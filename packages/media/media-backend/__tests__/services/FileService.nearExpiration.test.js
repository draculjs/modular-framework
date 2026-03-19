const FileService = require('../../src/services/FileService').default;
const File = require('../../src/models/FileModel');
const UserStorage = require('../../src/models/UserStorageModel');
const mongoHandler = require('../utils/mongo-handler');
const {
    TEST_USER_ID,
    USER_STORAGE_BY_LAST_ACCESS,
    USER_STORAGE_BY_CREATED_AT,
    createTestFile,
    daysAgo,
    daysFromNow
} = require('../data/test-data');

describe("FileService._isNearExpiration - TDD Tests", () => {

    beforeAll(async () => {
        await mongoHandler.connect();
    });

    afterAll(async () => {
        await mongoHandler.closeDatabase();
    });

    beforeEach(async () => {
        await mongoHandler.clearDatabase();
    });

    describe("_isNearExpiration", () => {

        test('should return true when file expires within threshold (lastAccess policy)', async () => {
            await UserStorage.create({
                ...USER_STORAGE_BY_LAST_ACCESS,
                fileExpirationTime: 1
            });

            const threshold = 12 * 60 * 60 * 1000;
            const lastAccessDate = new Date(Date.now() - threshold - (2 * 60 * 60 * 1000));
            await File.create(createTestFile({
                filename: 'near-expiry-lastaccess.json',
                lastAccess: lastAccessDate,
                createdBy: { user: TEST_USER_ID, username: 'testuser' }
            }));

            const file = await File.findOne({ filename: 'near-expiry-lastaccess.json' });
            const isNear = await FileService._isNearExpiration(file);

            expect(isNear).toBe(true);
        });

        test('should return true when file expires within threshold (createdAt policy)', async () => {
            await UserStorage.create({
                ...USER_STORAGE_BY_CREATED_AT,
                fileExpirationTime: 1
            });

            const threshold = 12 * 60 * 60 * 1000;
            const createdAtDate = new Date(Date.now() - threshold - (2 * 60 * 60 * 1000));
            await File.create(createTestFile({
                filename: 'near-expiry-createdat.json',
                lastAccess: daysAgo(1),
                createdAt: createdAtDate,
                createdBy: { user: TEST_USER_ID, username: 'testuser' }
            }));

            const file = await File.findOne({ filename: 'near-expiry-createdat.json' });
            const isNear = await FileService._isNearExpiration(file);

            expect(isNear).toBe(true);
        });

        test('should return false when file does not expire within threshold', async () => {
            await UserStorage.create({
                ...USER_STORAGE_BY_LAST_ACCESS,
                fileExpirationTime: 30
            });

            const lastAccessDate = daysAgo(1);
            await File.create(createTestFile({
                filename: 'not-near-expiry.json',
                lastAccess: lastAccessDate,
                createdBy: { user: TEST_USER_ID, username: 'testuser' }
            }));

            const file = await File.findOne({ filename: 'not-near-expiry.json' });
            const isNear = await FileService._isNearExpiration(file);

            expect(isNear).toBe(false);
        });

        test('should return false when file has already expired', async () => {
            await UserStorage.create({
                ...USER_STORAGE_BY_LAST_ACCESS,
                fileExpirationTime: 30
            });

            const lastAccessDate = daysAgo(31);
            await File.create(createTestFile({
                filename: 'already-expired.json',
                lastAccess: lastAccessDate,
                createdBy: { user: TEST_USER_ID, username: 'testuser' }
            }));

            const file = await File.findOne({ filename: 'already-expired.json' });
            const isNear = await FileService._isNearExpiration(file);

            expect(isNear).toBe(false);
        });

        test('should return false when user has no UserStorage', async () => {
            await File.create(createTestFile({
                filename: 'no-userstorage.json',
                createdBy: { user: TEST_USER_ID, username: 'testuser' }
            }));

            const file = await File.findOne({ filename: 'no-userstorage.json' });
            const isNear = await FileService._isNearExpiration(file);

            expect(isNear).toBe(false);
        });

        test('should handle file with very small expiration time (1 day)', async () => {
            await UserStorage.create({
                ...USER_STORAGE_BY_LAST_ACCESS,
                fileExpirationTime: 1
            });

            const threshold = 12 * 60 * 60 * 1000;
            const lastAccessDate = new Date(Date.now() - threshold - (2 * 60 * 60 * 1000));
            await File.create(createTestFile({
                filename: 'small-expiry.json',
                lastAccess: lastAccessDate,
                createdBy: { user: TEST_USER_ID, username: 'testuser' }
            }));

            const file = await File.findOne({ filename: 'small-expiry.json' });
            const isNear = await FileService._isNearExpiration(file);

            expect(isNear).toBe(true);
        });

        test('should correctly use threshold with deleteByCreatedAt policy', async () => {
            await UserStorage.create({
                ...USER_STORAGE_BY_CREATED_AT,
                fileExpirationTime: 1
            });

            const threshold = 12 * 60 * 60 * 1000;
            const createdAtDate = new Date(Date.now() - threshold - (2 * 60 * 60 * 1000));
            await File.create(createTestFile({
                filename: 'createdat-near.json',
                lastAccess: daysAgo(10),
                createdAt: createdAtDate,
                createdBy: { user: TEST_USER_ID, username: 'testuser' }
            }));

            const file = await File.findOne({ filename: 'createdat-near.json' });
            const isNear = await FileService._isNearExpiration(file);

            expect(isNear).toBe(true);
        });
    });

    describe("updateByRelativePath - expirationChanged emission", () => {

        test('should emit expirationChanged when file is near expiration', async () => {
            await UserStorage.create({
                ...USER_STORAGE_BY_LAST_ACCESS,
                fileExpirationTime: 1
            });

            const threshold = 12 * 60 * 60 * 1000;
            const lastAccessDate = new Date(Date.now() - threshold - (2 * 60 * 60 * 1000));
            await File.create(createTestFile({
                filename: 'emit-test-near.json',
                relativePath: '/tmp/test/emit-test-near.json',
                absolutePath: '/tmp/test/emit-test-near.json',
                lastAccess: lastAccessDate,
                createdBy: { user: TEST_USER_ID, username: 'testuser' }
            }));

            const eventSpy = jest.spyOn(FileService, 'emit');

            await FileService.updateByRelativePath('/tmp/test/emit-test-near.json');

            expect(eventSpy).toHaveBeenCalledWith('expirationChanged');
            eventSpy.mockRestore();
        });

        test('should NOT emit expirationChanged when file is NOT near expiration', async () => {
            await UserStorage.create({
                ...USER_STORAGE_BY_LAST_ACCESS,
                fileExpirationTime: 30
            });

            const lastAccessDate = daysAgo(1);
            await File.create(createTestFile({
                filename: 'emit-test-far.json',
                relativePath: '/tmp/test/emit-test-far.json',
                absolutePath: '/tmp/test/emit-test-far.json',
                lastAccess: lastAccessDate,
                createdBy: { user: TEST_USER_ID, username: 'testuser' }
            }));

            const eventSpy = jest.spyOn(FileService, 'emit');

            await FileService.updateByRelativePath('/tmp/test/emit-test-far.json');

            expect(eventSpy).not.toHaveBeenCalledWith('expirationChanged');
            eventSpy.mockRestore();
        });

        test('should update lastAccess and hits', async () => {
            await UserStorage.create({
                ...USER_STORAGE_BY_LAST_ACCESS,
                fileExpirationTime: 30
            });

            const originalDate = daysAgo(10);
            await File.create(createTestFile({
                filename: 'update-test.json',
                relativePath: '/tmp/test/update-test.json',
                absolutePath: '/tmp/test/update-test.json',
                lastAccess: originalDate,
                hits: 5,
                createdBy: { user: TEST_USER_ID, username: 'testuser' }
            }));

            await FileService.updateByRelativePath('/tmp/test/update-test.json');

            const updated = await File.findOne({ filename: 'update-test.json' });
            expect(updated.lastAccess.getTime()).toBeGreaterThan(originalDate.getTime());
            expect(updated.hits).toBe(6);
        });

        test('should NOT emit expirationChanged when user has no UserStorage', async () => {
            await File.create(createTestFile({
                filename: 'no-storage-emit.json',
                relativePath: '/tmp/test/no-storage-emit.json',
                absolutePath: '/tmp/test/no-storage-emit.json',
                createdBy: { user: TEST_USER_ID, username: 'testuser' }
            }));

            const eventSpy = jest.spyOn(FileService, 'emit');

            await FileService.updateByRelativePath('/tmp/test/no-storage-emit.json');

            expect(eventSpy).not.toHaveBeenCalled();
            eventSpy.mockRestore();
        });

        test('should emit expirationChanged when file expires in exactly threshold time', async () => {
            await UserStorage.create({
                ...USER_STORAGE_BY_LAST_ACCESS,
                fileExpirationTime: 1
            });

            const now = new Date();
            const threshold = 12 * 60 * 60 * 1000;
            const expireAt = now.getTime() + threshold;
            const lastAccessTime = expireAt - (1 * 24 * 60 * 60 * 1000);
            const lastAccessDate = new Date(lastAccessTime);

            await File.create(createTestFile({
                filename: 'exact-threshold.json',
                relativePath: '/tmp/test/exact-threshold.json',
                absolutePath: '/tmp/test/exact-threshold.json',
                lastAccess: lastAccessDate,
                createdBy: { user: TEST_USER_ID, username: 'testuser' }
            }));

            const eventSpy = jest.spyOn(FileService, 'emit');

            await FileService.updateByRelativePath('/tmp/test/exact-threshold.json');

            expect(eventSpy).toHaveBeenCalledWith('expirationChanged');
            eventSpy.mockRestore();
        });
    });

    describe("Coherence Principle: Access resets expiration", () => {

        test('accessing a file near expiration should prevent premature deletion', async () => {
            await UserStorage.create({
                ...USER_STORAGE_BY_LAST_ACCESS,
                fileExpirationTime: 1
            });

            const threshold = 12 * 60 * 60 * 1000;
            const lastAccessDate = new Date(Date.now() - threshold - (2 * 60 * 60 * 1000));
            const file = await File.create(createTestFile({
                filename: 'coherence-test.json',
                relativePath: '/tmp/test/coherence-test.json',
                absolutePath: '/tmp/test/coherence-test.json',
                lastAccess: lastAccessDate,
                createdBy: { user: TEST_USER_ID, username: 'testuser' }
            }));

            await FileService.updateByRelativePath('/tmp/test/coherence-test.json');

            const nextExpiration = await FileService.getNextExpirationTimestamp();

            const now = new Date();
            const oneDayFromNow = now.getTime() + (1 * 24 * 60 * 60 * 1000);

            expect(nextExpiration).toBeGreaterThan(oneDayFromNow - (12 * 60 * 60 * 1000));
        });

        test('accessing a file far from expiration should not affect scheduler unnecessarily', async () => {
            await UserStorage.create({
                ...USER_STORAGE_BY_LAST_ACCESS,
                fileExpirationTime: 1
            });

            const lastAccessDate = new Date();
            const file = await File.create(createTestFile({
                filename: 'no-unnecessary-emit.json',
                relativePath: '/tmp/test/no-unnecessary-emit.json',
                absolutePath: '/tmp/test/no-unnecessary-emit.json',
                lastAccess: lastAccessDate,
                createdBy: { user: TEST_USER_ID, username: 'testuser' }
            }));

            const eventSpy = jest.spyOn(FileService, 'emit');

            await FileService.updateByRelativePath('/tmp/test/no-unnecessary-emit.json');

            expect(eventSpy).not.toHaveBeenCalledWith('expirationChanged');
            eventSpy.mockRestore();
        });
    });
});
