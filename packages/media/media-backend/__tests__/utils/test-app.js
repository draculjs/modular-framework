const express = require('express');
const multer = require('multer');
const { FILE_SHOW_ALL, FILE_SHOW_OWN, FILE_SHOW_PUBLIC, FILE_UPDATE_ALL, FILE_UPDATE_OWN, FILE_DELETE_ALL, FILE_DELETE_OWN, FILE_CREATE } = require('../../src/permissions/File');

let mockFetchMyGroups = jest.fn().mockResolvedValue([]);
let mockFindUser = jest.fn().mockImplementation((userId) => {
    return Promise.resolve({
        id: userId,
        username: 'testuser'
    });
});
let mockFindUserByUsername = jest.fn().mockImplementation((username) => {
    return Promise.resolve({
        id: '123456789012345678901234',
        username: username
    });
});

jest.mock('../../src/services/UserStorageService', () => ({
    findUserStorageByUser: jest.fn().mockImplementation((user) => {
        return Promise.resolve({
            user: { id: user.id, username: 'testuser' },
            capacity: 1024,
            usedSpace: 0,
            maxFileSize: 100,
            fileExpirationTime: 30
        });
    }),
    updateUserUsedStorage: jest.fn().mockResolvedValue(true)
}));

jest.mock('@dracul/user-backend', () => ({
    GroupService: {
        fetchMyGroups: (...args) => mockFetchMyGroups(...args)
    },
    UserService: {
        findUser: (...args) => mockFindUser(...args),
        findUserByUsername: (...args) => mockFindUserByUsername(...args)
    }
}));

function setFetchMyGroupsMock(mockFn) {
    if (typeof mockFn === 'function') {
        mockFetchMyGroups = mockFn;
    } else {
        mockFetchMyGroups = jest.fn().mockResolvedValue(mockFn);
    }
}

function resetFetchMyGroups() {
    mockFetchMyGroups = jest.fn().mockResolvedValue([]);
}

function setFindUserMock(mockFn) {
    mockFindUser = mockFn;
}

function resetFindUserMock() {
    mockFindUser = jest.fn().mockImplementation((userId) => {
        return Promise.resolve({
            id: userId,
            username: 'testuser'
        });
    });
}

const upload = multer();

function createTestApp(mockRbac) {
    const app = express();
    app.use(express.json());
    
    const mockRequireAuthentication = (req, res, next) => {
        if (!req.headers['x-user-id']) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = {
            id: req.headers['x-user-id'],
            username: req.headers['x-username'] || 'testuser'
        };
        req.rbac = mockRbac;
        next();
    };

    const mockRequireAuthorization = (allowedPermissions) => (req, res, next) => {
        const hasPermission = allowedPermissions.some(perm => mockRbac.isAllowed(req.user.id, perm));
        if (!hasPermission) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    };

    app.use('/api', require('../../src/rest/routers/FileRouter').router);

    return app;
}

function createTestAppWithDirectRouter(mockRbac) {
    const app = express();
    app.use(express.json());
    
    const mockRequireAuthentication = (req, res, next) => {
        if (!req.headers['x-user-id']) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = {
            id: req.headers['x-user-id'],
            username: req.headers['x-username'] || 'testuser'
        };
        req.rbac = mockRbac;
        next();
    };

    const mockRequireAuthorization = (allowedPermissions) => (req, res, next) => {
        const hasPermission = allowedPermissions.some(perm => mockRbac.isAllowed(req.user.id, perm));
        if (!hasPermission) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    };

    const FileRouter = require('../../src/rest/routers/FileRouter');
    const FileService = require('../../src/services/FileService').default;
    const FileDTO = require('../../src/DTOs/FileDTO').default;
    const File = require('../../src/models/FileModel');
    const router = express.Router();
    
    router.get('/file/:id', [mockRequireAuthentication, mockRequireAuthorization([FILE_SHOW_ALL, FILE_SHOW_PUBLIC, FILE_SHOW_OWN])], async function (req, res) {
        try {
            const fileId = req.params.id || '';
            const isValidMongoId = /^[a-fA-F0-9]{24}$/.test(fileId);
            
            if (!isValidMongoId) {
                return res.status(400).json({ message: "You must provide a valid file ID." });
            }

            const userId = req.user.id;
            const userCanSeeAllFiles = req.rbac.isAllowed(userId, FILE_SHOW_ALL);
            const userCanSeeItsOwnFiles = req.rbac.isAllowed(userId, FILE_SHOW_OWN);
            const userCanSeePublicFiles = req.rbac.isAllowed(userId, FILE_SHOW_PUBLIC);
            const userGroups = await mockFetchMyGroups(userId);

            const filter = FileService._filterByPermissions(userId, userCanSeeAllFiles, userCanSeeItsOwnFiles, userCanSeePublicFiles, userGroups);
            const file = await File.findOne({ _id: fileId, ...filter }).lean();

            if (!file) {
                res.status(404).send('File not found');
            } else {
                res.status(200).json({
                    id: file._id,
                    filename: file.filename,
                    description: file.description,
                    tags: file.tags,
                    mimetype: file.mimetype,
                    encoding: file.encoding,
                    extension: file.extension,
                    type: file.type,
                    relativePath: file.relativePath,
                    absolutePath: file.absolutePath,
                    size: file.size,
                    url: file.url,
                    lastAccess: file.lastAccess,
                    createdAt: file.createdAt,
                    createdBy: file.createdBy?.username || 'unknown',
                    expirationDate: file.expirationDate,
                    isPublic: file.isPublic,
                    hits: file.hits,
                    groups: file.groups,
                    users: file.users,
                    fileReplaces: file.fileReplaces
                });
            }
        } catch (error) {
            console.error(`Error: ${error}`);
            res.status(500).send(error.message || error);
        }
    });

    router.patch('/file/:id', [mockRequireAuthentication, mockRequireAuthorization([FILE_UPDATE_ALL, FILE_UPDATE_OWN])], async function (req, res) {
        try {
            const FileService = require('../../src/services/FileService').default;
            
            const fileToUpdateId = req.params.id;
            const { description, expirationDate, tags, isPublic } = req.body;

            if (!fileToUpdateId) throw new Error("You must provide the ID of the file you want to update");
            if (!description && !expirationDate && !tags && !isPublic) {
                throw new Error(
                    'You must provide new values for any of the following file fields: description, expirationDate, tags, or isPublic'
                );
            }

            const userCanSeeAllFiles = req.rbac?.isAllowed(req.user.id, FILE_SHOW_ALL);
            const userCanSeeItsOwnFiles = req.rbac?.isAllowed(req.user.id, FILE_SHOW_OWN) || req.rbac?.isAllowed(req.user.id, FILE_UPDATE_OWN);
            const permissionType = (userCanSeeAllFiles) ? FILE_SHOW_ALL : (userCanSeeItsOwnFiles) ? FILE_SHOW_OWN : null;

            const updateFileResult = await FileService.updateFileMetadata(req.params.id, req.user, permissionType, { description, expirationDate, tags, isPublic });
            if (!updateFileResult) {
                throw new Error("An error happened: we didnt get an update file operation's result");
            } else {
                res.status(200).json(updateFileResult);
                return;
            }
        } catch (error) {
            console.error(`Error at PATCH files/:id: '${error}'`);
            res.status(500).send(error);
        }
    });

    router.delete('/file/:id', [mockRequireAuthentication, mockRequireAuthorization([FILE_DELETE_ALL, FILE_DELETE_OWN])], async function (req, res) {
        try {
            const FileService = require('../../src/services/FileService').default;
            const userGroups = await mockFetchMyGroups(req.user.id);
            
            const fileToDeleteId = req.params.id || '';
            const isValidMongoId = /^[a-fA-F0-9]{24}$/.test(fileToDeleteId);
            if (!fileToDeleteId || !isValidMongoId) {
                res.status(400).json({ message: "You must provide a valid file ID." });
            } else {
                const userCanDeleteAllFiles = req.rbac?.isAllowed(req.user.id, FILE_DELETE_ALL);
                const userCanDeleteItsOwnFiles = req.rbac?.isAllowed(req.user.id, FILE_DELETE_OWN);
                const userCanSeePublicFiles = req.rbac.isAllowed(req.user.id, FILE_SHOW_PUBLIC);

                const filter = FileService._filterByPermissions(req.user.id, userCanDeleteAllFiles, userCanDeleteItsOwnFiles, userCanSeePublicFiles, userGroups);
                const fileToDelete = await File.findOne({ _id: fileToDeleteId, ...filter }).lean();
                
                if (!fileToDelete) {
                    throw new Error('File not found');
                }

                await File.deleteOne({ _id: fileToDeleteId });
                res.status(200).json({ message: 'The file was deleted', id: fileToDeleteId });
            }
        } catch (error) {
            if (error && error.message.includes('File not found')) {
                res.status(404).json({ message: error.message });
            } else {
                console.error(`Error at DELETE /file/:id: '${error}'`);
                res.status(500).json({ message: "Internal Server Error" });
            }
        }
    });

    router.put('/file/:id', [mockRequireAuthentication, mockRequireAuthorization([FILE_UPDATE_ALL, FILE_UPDATE_OWN]), upload.single('file')], async function (req, res) {
        try {
            if (!req.params.id) throw new Error("You must provide the ID of the file you want to update");
            if (!req.file) {
                return res.status(400).json({ message: 'File was not provided' });
            }
            
            const userCanSeeAllFiles = req.rbac?.isAllowed(req.user.id, FILE_SHOW_ALL);
            const userCanSeeItsOwnFiles = req.rbac?.isAllowed(req.user.id, FILE_SHOW_OWN) || req.rbac?.isAllowed(req.user.id, FILE_UPDATE_OWN);
            const permissionType = (userCanSeeAllFiles) ? FILE_SHOW_ALL : (userCanSeeItsOwnFiles) ? FILE_SHOW_OWN : null;

            const FileService = require('../../src/services/FileService').default;
            const file = {
                filename: req.file.originalname,
                mimetype: req.file.mimetype,
                createReadStream: () => require('stream').Readable.from(req.file.buffer),
                encoding: req.file.encoding,
            };
        
            const updateFileResult = await FileService.updateFileRest(req.params.id, req.user, permissionType, file, req.body);
            if (updateFileResult) {
                res.status(200).send('File updated');
            } else {
                res.status(400).send('File extension mismatch during update');
            }
        } catch (error) {
            console.error(`Error at PUT files/:id: '${error}'`);
            res.status(500).send(error);
        }
    });

    app.use('/api', router);
    return app;
}

function createMockRbac(permissions = {}) {
    return {
        isAllowed: jest.fn((userId, permission) => {
            return permissions[permission] === true;
        }),
        permissions
    };
}

function setRbacPermissions(mockRbac, permissions) {
    mockRbac.isAllowed = jest.fn((userId, permission) => {
        return permissions[permission] === true;
    });
    mockRbac.permissions = permissions;
}

module.exports = {
    createTestApp,
    createTestAppWithDirectRouter,
    createMockRbac,
    setRbacPermissions,
    setFetchMyGroupsMock,
    resetFetchMyGroups,
    setFindUserMock,
    resetFindUserMock,
    mockFetchMyGroups,
    mockFindUser
};
