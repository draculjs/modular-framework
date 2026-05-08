const { Readable } = require('stream');

jest.mock('../../src/services/UserStorageService', () => ({
    findUserStorageByUser: jest.fn(),
    updateUserUsedStorage: jest.fn()
}));

jest.mock('../../src/services/helpers/randomString', () => jest.fn(() => 'ABCDEF'));

jest.mock('../../src/services/helpers/baseUrl', () => jest.fn(() => 'http://media.test/'));

jest.mock('../../src/services/helpers/storeFile', () => {
    class expirationDateMustBeOlderError extends Error {}
    return {
        __esModule: true,
        default: jest.fn(),
        expirationDateMustBeOlderError
    };
});

jest.mock('../../src/models/FileModel', () => {
    return jest.fn().mockImplementation(function FileModelMock(data) {
        Object.assign(this, data);
        this._id = 'file-id';
        this.save = jest.fn().mockResolvedValue(this);
    });
});

jest.mock('../../src/services/FileService', () => ({
    __esModule: true,
    default: {
        emit: jest.fn()
    }
}));

const uploadService = require('../../src/services/UploadService').default;
const storeFile = require('../../src/services/helpers/storeFile').default;
const File = require('../../src/models/FileModel');
const FileService = require('../../src/services/FileService').default;
const {
    findUserStorageByUser,
    updateUserUsedStorage
} = require('../../src/services/UserStorageService');

const user = {
    id: 'user-id',
    username: 'tester'
};

const fileInput = (filename = 'demo.png') => Promise.resolve({
    filename,
    mimetype: 'image/png',
    encoding: '7bit',
    createReadStream: () => Readable.from(['file content'])
});

describe('UploadService explicit expirationDate', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        storeFile.mockResolvedValue({ finish: true, bytesWritten: 1024 });
        findUserStorageByUser.mockResolvedValue({
            fileExpirationTime: 1,
            filesPrivacy: 'private'
        });
    });

    test('allows creating a file with an explicit future expirationDate beyond userStorage fileExpirationTime', async () => {
        const expirationDate = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString();

        const result = await uploadService(
            user,
            fileInput(),
            expirationDate,
            true,
            'description',
            ['tag'],
            [],
            []
        );

        expect(result.expirationDate).toBe(expirationDate);
        expect(File).toHaveBeenCalledWith(expect.objectContaining({
            filename: 'demo-ABCDEF.png',
            expirationDate,
            isPublic: true
        }));
        expect(updateUserUsedStorage).toHaveBeenCalledWith(user.id, 1024 / (1024 * 1024));
        expect(FileService.emit).toHaveBeenCalledWith('expirationChanged');
    });

    test('rejects creating a file with an explicit past expirationDate', async () => {
        const expirationDate = new Date(Date.now() - 60 * 1000).toISOString();

        await expect(uploadService(
            user,
            fileInput(),
            expirationDate,
            true,
            'description',
            [],
            [],
            []
        )).rejects.toThrow('Expiration date must be older than current date');

        expect(File).not.toHaveBeenCalled();
        expect(updateUserUsedStorage).not.toHaveBeenCalled();
    });
});
