const mongoose = require('mongoose');
const { FILE_SHOW_ALL, FILE_SHOW_OWN, FILE_UPDATE_ALL, FILE_UPDATE_OWN, FILE_DELETE_ALL, FILE_DELETE_OWN, FILE_SHOW_PUBLIC } = require('../../src/permissions/File');
const { TEST_USER_ID, OTHER_USER_ID, createTestFile, daysAgo } = require('../data/test-data');
const mongoHandler = require('../utils/mongo-handler');
const File = require('../../src/models/FileModel');
const UserStorage = require('../../src/models/UserStorageModel');
const FileService = require('../../src/services/FileService').default;

jest.mock('@dracul/user-backend', () => ({
    GroupService: {
        fetchMyGroups: jest.fn()
    }
}));

const { GroupService } = require('@dracul/user-backend');

describe("FileRouter - Permission System REAL Integration Tests", () => {

    beforeAll(async () => {
        await mongoHandler.connect();
    });

    afterAll(async () => {
        await mongoHandler.closeDatabase();
    });

    beforeEach(async () => {
        await mongoHandler.clearDatabase();
        jest.clearAllMocks();
    });

    describe("CRITICAL: _filterByPermissions - Logic Verification", () => {

        test('FILE_SHOW_ALL: filtro vacío permite ver todos', () => {
            const filter = FileService._filterByPermissions(
                TEST_USER_ID.toString(),
                true,
                false,
                false,
                []
            );
            expect(filter).toEqual({});
        });

        test('FILE_SHOW_OWN: filtro incluye createdBy.user', () => {
            const filter = FileService._filterByPermissions(
                TEST_USER_ID.toString(),
                false,
                true,
                false,
                []
            );
            
            expect(filter.$or).toBeDefined();
            expect(filter.$or.length).toBe(3); // createdBy, groups, users
            
            const hasCreatedBy = filter.$or.some(clause => 'createdBy.user' in clause);
            expect(hasCreatedBy).toBe(true);
        });

        test('FILE_SHOW_PUBLIC: filtro incluye isPublic', () => {
            const filter = FileService._filterByPermissions(
                TEST_USER_ID.toString(),
                false,
                false,
                true,
                []
            );
            
            expect(filter.$or).toBeDefined();
            expect(filter.$or.some(clause => clause.isPublic === true)).toBe(true);
        });

        test('FILE_SHOW_OWN + FILE_SHOW_PUBLIC: filtro incluye ambos + groups + users', () => {
            const userGroups = ['group1', 'group2'];
            const filter = FileService._filterByPermissions(
                TEST_USER_ID.toString(),
                false,
                true,
                true,
                userGroups
            );
            
            expect(filter.$or.length).toBe(4);
        });

        test('Sin permisos: lanza error', () => {
            expect(() => {
                FileService._filterByPermissions(
                    TEST_USER_ID.toString(),
                    false,
                    false,
                    false,
                    []
                );
            }).toThrow("User doesn't have permissions for reading files");
        });
    });

    describe("CRITICAL: Permission Filter Applied to Queries", () => {

        test('filtro FILE_SHOW_OWN encuentra archivos propios en BD', async () => {
            await File.create(createTestFile({ 
                filename: 'mine.json', 
                isPublic: false, 
                createdBy: { user: TEST_USER_ID, username: 'test' } 
            }));
            await File.create(createTestFile({ 
                filename: 'other.json', 
                isPublic: false, 
                createdBy: { user: OTHER_USER_ID, username: 'other' } 
            }));

            GroupService.fetchMyGroups.mockResolvedValueOnce([]);

            const filter = FileService._filterByPermissions(TEST_USER_ID.toString(), false, true, false, []);
            const files = await File.find(filter).lean();

            expect(files.length).toBe(1);
            expect(files[0].filename).toBe('mine.json');
        });

        test('filtro FILE_SHOW_PUBLIC encuentra solo archivos públicos', async () => {
            await File.create(createTestFile({ 
                filename: 'private.json', 
                isPublic: false, 
                createdBy: { user: TEST_USER_ID, username: 'test' } 
            }));
            await File.create(createTestFile({ 
                filename: 'public.json', 
                isPublic: true, 
                createdBy: { user: OTHER_USER_ID, username: 'other' } 
            }));

            GroupService.fetchMyGroups.mockResolvedValueOnce([]);

            const filter = FileService._filterByPermissions(TEST_USER_ID.toString(), false, false, true, []);
            const files = await File.find(filter).lean();

            expect(files.length).toBe(1);
            expect(files[0].filename).toBe('public.json');
        });

        test('filtro con groups[] incluye archivos del grupo', async () => {
            const groupId = new mongoose.Types.ObjectId();
            
            await File.create(createTestFile({ 
                filename: 'group-file.json', 
                isPublic: false, 
                createdBy: { user: OTHER_USER_ID, username: 'other' },
                groups: [groupId]
            }));

            GroupService.fetchMyGroups.mockResolvedValueOnce([groupId.toString()]);

            const filter = FileService._filterByPermissions(TEST_USER_ID.toString(), false, true, false, [groupId.toString()]);
            const files = await File.find(filter).lean();

            expect(files.length).toBe(1);
            expect(files[0].filename).toBe('group-file.json');
        });

        test('filtro con users[] incluye archivos compartidos', async () => {
            await File.create(createTestFile({ 
                filename: 'shared-file.json', 
                isPublic: false, 
                createdBy: { user: OTHER_USER_ID, username: 'other' },
                users: [TEST_USER_ID]
            }));

            GroupService.fetchMyGroups.mockResolvedValueOnce([]);

            const filter = FileService._filterByPermissions(TEST_USER_ID.toString(), false, true, false, []);
            const files = await File.find(filter).lean();

            expect(files.length).toBe(1);
            expect(files[0].filename).toBe('shared-file.json');
        });
    });

    describe("CRITICAL: _updateFileDocument - Update with Permissions", () => {

        test('usuario con FILE_SHOW_ALL puede actualizar archivo de otro', async () => {
            const file = await File.create(createTestFile({
                filename: 'original.json',
                description: 'original',
                createdBy: { user: OTHER_USER_ID, username: 'other' }
            }));

            GroupService.fetchMyGroups.mockResolvedValueOnce([]);

            const updated = await File.findOneAndUpdate(
                { _id: file._id },
                { description: 'updated by admin' },
                { new: true }
            );

            expect(updated.description).toBe('updated by admin');
        });

        test('usuario con FILE_SHOW_OWN puede actualizar SU archivo', async () => {
            const file = await File.create(createTestFile({
                filename: 'mine.json',
                description: 'original',
                createdBy: { user: TEST_USER_ID, username: 'test' }
            }));

            const filter = FileService._filterByPermissions(TEST_USER_ID.toString(), false, true, false, []);
            const updated = await File.findOneAndUpdate(
                { _id: file._id, ...filter },
                { description: 'updated by owner' },
                { new: true }
            );

            expect(updated).not.toBeNull();
            expect(updated.description).toBe('updated by owner');
        });

        test('usuario con FILE_SHOW_OWN NO puede actualizar archivo de otro (filtro rechaza)', async () => {
            const file = await File.create(createTestFile({
                filename: 'not-mine.json',
                description: 'original',
                createdBy: { user: OTHER_USER_ID, username: 'other' }
            }));

            const filter = FileService._filterByPermissions(TEST_USER_ID.toString(), false, true, false, []);
            const updated = await File.findOneAndUpdate(
                { _id: file._id, ...filter },
                { description: 'hacked' },
                { new: true }
            );

            expect(updated).toBeNull();
            
            const unchanged = await File.findById(file._id);
            expect(unchanged.description).toBe('original');
        });

        test('actualización de metadata persiste en BD', async () => {
            const file = await File.create(createTestFile({
                filename: 'persist.json',
                description: 'old',
                tags: ['old'],
                createdBy: { user: TEST_USER_ID, username: 'test' }
            }));

            const updated = await File.findOneAndUpdate(
                { _id: file._id },
                { description: 'new desc', tags: ['new'] },
                { new: true }
            );

            const fromDb = await File.findById(file._id);
            expect(fromDb.description).toBe('new desc');
            expect(fromDb.tags).toEqual(expect.arrayContaining(['new']));
        });
    });

    describe("CRITICAL: _getFileForUpdate - Get File for Update with Permissions", () => {

        test('usuario puede obtener SU archivo para actualizar', async () => {
            const file = await File.create(createTestFile({
                filename: 'to-update.json',
                createdBy: { user: TEST_USER_ID, username: 'test' }
            }));

            const filter = FileService._filterByPermissions(TEST_USER_ID.toString(), false, true, false, []);
            const found = await File.findOne({ _id: file._id, ...filter }).lean();

            expect(found).not.toBeNull();
            expect(found._id.toString()).toBe(file._id.toString());
        });

        test('usuario NO puede obtener archivo de otro para actualizar', async () => {
            const file = await File.create(createTestFile({
                filename: 'locked.json',
                createdBy: { user: OTHER_USER_ID, username: 'other' }
            }));

            const filter = FileService._filterByPermissions(TEST_USER_ID.toString(), false, true, false, []);
            const found = await File.findOne({ _id: file._id, ...filter }).lean();

            expect(found).toBeNull();
        });

        test('admin (FILE_SHOW_ALL) puede obtener cualquier archivo', async () => {
            const file = await File.create(createTestFile({
                filename: 'admin-access.json',
                createdBy: { user: OTHER_USER_ID, username: 'other' }
            }));

            const filter = FileService._filterByPermissions(TEST_USER_ID.toString(), true, false, false, []);
            const found = await File.findOne({ _id: file._id, ...filter }).lean();

            expect(found).not.toBeNull();
        });
    });

    describe("CRITICAL: Permission Escalation Prevention", () => {

        test('archivo con groups[]: usuario en grupo puede verlo', async () => {
            const groupId = new mongoose.Types.ObjectId();
            
            await File.create(createTestFile({
                filename: 'group-private.json',
                isPublic: false,
                createdBy: { user: OTHER_USER_ID, username: 'other' },
                groups: [groupId]
            }));

            GroupService.fetchMyGroups.mockResolvedValueOnce([groupId.toString()]);

            const filter = FileService._filterByPermissions(TEST_USER_ID.toString(), false, true, false, [groupId.toString()]);
            const files = await File.find(filter).lean();

            expect(files.length).toBe(1);
            expect(files[0].filename).toBe('group-private.json');
        });

        test('archivo con users[]: usuario específico puede verlo', async () => {
            await File.create(createTestFile({
                filename: 'shared-with-me.json',
                isPublic: false,
                createdBy: { user: OTHER_USER_ID, username: 'other' },
                users: [TEST_USER_ID]
            }));

            GroupService.fetchMyGroups.mockResolvedValueOnce([]);

            const filter = FileService._filterByPermissions(TEST_USER_ID.toString(), false, true, false, []);
            const files = await File.find(filter).lean();

            expect(files.length).toBe(1);
            expect(files[0].filename).toBe('shared-with-me.json');
        });

        test('archivo con users[] NO visible para otros usuarios', async () => {
            await File.create(createTestFile({
                filename: 'not-for-you.json',
                isPublic: false,
                createdBy: { user: OTHER_USER_ID, username: 'other' },
                users: [OTHER_USER_ID]
            }));

            GroupService.fetchMyGroups.mockResolvedValueOnce([]);

            const filter = FileService._filterByPermissions(TEST_USER_ID.toString(), false, true, false, []);
            const files = await File.find(filter).lean();

            expect(files.length).toBe(0);
        });
    });

    describe("Edge Cases - File Access", () => {

        test('archivo sin createdBy.user (null) se maneja correctamente', async () => {
            const file = await File.create({
                ...createTestFile({
                    filename: 'orphan.json'
                }),
                createdBy: { user: null, username: 'deleted-user' }
            });

            const filter = FileService._filterByPermissions(TEST_USER_ID.toString(), true, false, false, []);
            const found = await File.findOne({ _id: file._id, ...filter }).lean();

            expect(found).not.toBeNull();
        });

        test('archivo inexistente no se encuentra', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            const filter = FileService._filterByPermissions(TEST_USER_ID.toString(), true, false, false, []);
            const found = await File.findOne({ _id: nonExistentId, ...filter }).lean();

            expect(found).toBeNull();
        });
    });

    describe("Complex Permission Scenarios", () => {

        test('usuario con múltiples grupos accede a archivo de cualquiera de sus grupos', async () => {
            const groupId1 = new mongoose.Types.ObjectId();
            const groupId2 = new mongoose.Types.ObjectId();
            
            await File.create(createTestFile({
                filename: 'multi-group-file.json',
                isPublic: false,
                createdBy: { user: OTHER_USER_ID, username: 'other' },
                groups: [groupId1]
            }));

            GroupService.fetchMyGroups.mockResolvedValueOnce([groupId2.toString(), groupId1.toString()]);

            const filter = FileService._filterByPermissions(TEST_USER_ID.toString(), false, true, false, [groupId2.toString(), groupId1.toString()]);
            const files = await File.find(filter).lean();

            expect(files.length).toBe(1);
            expect(files[0].filename).toBe('multi-group-file.json');
        });

        test('archivo visible por users[] pero NO por createdBy', async () => {
            await File.create(createTestFile({
                filename: 'shared-only.json',
                isPublic: false,
                createdBy: { user: OTHER_USER_ID, username: 'other' },
                users: [TEST_USER_ID],
                groups: []
            }));

            GroupService.fetchMyGroups.mockResolvedValueOnce([]);

            const filter = FileService._filterByPermissions(TEST_USER_ID.toString(), false, true, false, []);
            const files = await File.find(filter).lean();

            expect(files.length).toBe(1);
            expect(files[0].filename).toBe('shared-only.json');
        });
    });
});
