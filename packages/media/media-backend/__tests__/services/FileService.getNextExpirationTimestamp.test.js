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

describe("FileService.getNextExpirationTimestamp - Integration Tests", () => {

    beforeAll(async () => {
        await mongoHandler.connect();
    });

    afterAll(async () => {
        await mongoHandler.closeDatabase();
    });

    beforeEach(async () => {
        await mongoHandler.clearDatabase();
    });

    describe("Empty database", () => {
        test('should return null when no files exist', async () => {
            const result = await FileService.getNextExpirationTimestamp();
            expect(result).toBeNull();
        });
    });

    describe("Explicit expirationDate", () => {
        test('should return timestamp of nearest explicit expiration', async () => {
            await File.create(createTestFile({
                expirationDate: daysFromNow(5),
                filename: 'explicit-5days.json'
            }));
            await File.create(createTestFile({
                expirationDate: daysFromNow(10),
                filename: 'explicit-10days.json'
            }));

            const result = await FileService.getNextExpirationTimestamp();

            expect(result).not.toBeNull();
            const expectedTs = daysFromNow(5).getTime();
            expect(result).toBeLessThanOrEqual(expectedTs);
        });

        test('should return null when only past expirationDates exist', async () => {
            await File.create(createTestFile({
                expirationDate: daysAgo(5),
                filename: 'past-explicit.json'
            }));

            const result = await FileService.getNextExpirationTimestamp();

            expect(result).toBeNull();
        });

        test('should ignore files with expirationDate = null', async () => {
            await UserStorage.create(USER_STORAGE_BY_LAST_ACCESS);
            await File.create(createTestFile({
                expirationDate: null,
                lastAccess: daysAgo(40),
                filename: 'policy-expired.json'
            }));

            const result = await FileService.getNextExpirationTimestamp();

            expect(result).toBeNull();
        });
    });

    describe("Policy-based expiration", () => {
        test('should return timestamp based on deleteByLastAccess policy', async () => {
            await UserStorage.create(USER_STORAGE_BY_LAST_ACCESS);
            await File.create(createTestFile({
                expirationDate: null,
                lastAccess: daysAgo(10),
                filename: 'policy-file.json'
            }));

            const result = await FileService.getNextExpirationTimestamp();

            expect(result).not.toBeNull();
            const expectedExpiry = daysAgo(10).getTime() + (30 * 24 * 60 * 60 * 1000);
            expect(result).toBeLessThanOrEqual(expectedExpiry);
        });

        test('should return timestamp based on deleteByCreatedAt policy', async () => {
            await UserStorage.create(USER_STORAGE_BY_CREATED_AT);
            await File.create(createTestFile({
                expirationDate: null,
                createdAt: daysAgo(10),
                filename: 'policy-created.json'
            }));

            const result = await FileService.getNextExpirationTimestamp();

            expect(result).not.toBeNull();
        });

        test('should return null when only past policy expirations exist', async () => {
            await UserStorage.create(USER_STORAGE_BY_LAST_ACCESS);
            await File.create(createTestFile({
                expirationDate: null,
                lastAccess: daysAgo(60),
                filename: 'past-policy.json'
            }));

            const result = await FileService.getNextExpirationTimestamp();

            expect(result).toBeNull();
        });
    });

    describe("Mixed explicit and policy", () => {
        test('should return earliest of explicit vs policy', async () => {
            await UserStorage.create(USER_STORAGE_BY_LAST_ACCESS);
            
            await File.create(createTestFile({
                expirationDate: daysFromNow(30),
                filename: 'explicit-later.json'
            }));
            await File.create(createTestFile({
                expirationDate: null,
                lastAccess: daysAgo(5),
                filename: 'policy-sooner.json'
            }));

            const result = await FileService.getNextExpirationTimestamp();

            expect(result).not.toBeNull();
            const expectedPolicyTs = daysAgo(5).getTime() + (30 * 24 * 60 * 60 * 1000);
            expect(result).toBeLessThanOrEqual(expectedPolicyTs);
        });

        test('should prefer explicit if sooner than policy', async () => {
            await UserStorage.create(USER_STORAGE_BY_LAST_ACCESS);
            
            await File.create(createTestFile({
                expirationDate: daysFromNow(5),
                filename: 'explicit-soon.json'
            }));
            await File.create(createTestFile({
                expirationDate: null,
                lastAccess: daysAgo(5),
                filename: 'policy-later.json'
            }));

            const result = await FileService.getNextExpirationTimestamp();

            expect(result).not.toBeNull();
            expect(result).toBeLessThanOrEqual(daysFromNow(5).getTime());
        });
    });

    describe("Multiple files", () => {
        test('should return nearest expiration among multiple files', async () => {
            await File.create([
                createTestFile({ expirationDate: daysFromNow(15), filename: 'mid.json' }),
                createTestFile({ expirationDate: daysFromNow(30), filename: 'far.json' }),
                createTestFile({ expirationDate: daysFromNow(3), filename: 'near.json' }),
            ]);

            const result = await FileService.getNextExpirationTimestamp();

            expect(result).not.toBeNull();
            expect(result).toBeLessThanOrEqual(daysFromNow(3).getTime());
        });
    });

    describe("Edge cases", () => {
        test('should handle UserStorage with fileExpirationTime = 0', async () => {
            await UserStorage.create({
                ...USER_STORAGE_BY_LAST_ACCESS,
                fileExpirationTime: 0
            });
            await File.create(createTestFile({
                expirationDate: null,
                lastAccess: daysAgo(1),
                filename: 'zero-expiry.json'
            }));

            const result = await FileService.getNextExpirationTimestamp();

            expect(result).toBeNull();
        });

        test('should handle files without UserStorage', async () => {
            await File.create(createTestFile({
                expirationDate: daysFromNow(5),
                filename: 'no-storage.json'
            }));

            const result = await FileService.getNextExpirationTimestamp();

            expect(result).not.toBeNull();
        });
    });
});
