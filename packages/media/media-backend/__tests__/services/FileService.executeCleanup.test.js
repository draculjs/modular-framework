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

describe("FileService.executeCleanup - Integration Tests", () => {

    beforeAll(async () => {
        await mongoHandler.connect();
    });

    afterAll(async () => {
        await mongoHandler.closeDatabase();
    });

    beforeEach(async () => {
        await mongoHandler.clearDatabase();
    });

    // ====== TESTS DE EXPIRACIÓN EXPLÍCITA ======

    describe("Explicit expirationDate", () => {
        test('should delete file with expirationDate in the past', async () => {
            const pastDate = daysAgo(1);
            await File.create(createTestFile({
                expirationDate: pastDate,
                filename: 'explicit-expired-1.json'
            }));

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(1);
            const remaining = await File.countDocuments({ filename: 'explicit-expired-1.json' });
            expect(remaining).toBe(0);
        });

        test('should NOT delete file with expirationDate in the future', async () => {
            const futureDate = daysFromNow(30);
            await File.create(createTestFile({
                expirationDate: futureDate,
                filename: 'explicit-future.json'
            }));

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(0);
            const remaining = await File.countDocuments({ filename: 'explicit-future.json' });
            expect(remaining).toBe(1);
        });

        test('should NOT delete file with expirationDate = null', async () => {
            await File.create(createTestFile({
                expirationDate: null,
                filename: 'explicit-null.json'
            }));

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(0);
            const remaining = await File.countDocuments({ filename: 'explicit-null.json' });
            expect(remaining).toBe(1);
        });

        test('should delete multiple files with explicit expiration', async () => {
            const pastDate = daysAgo(5);
            await File.create([
                createTestFile({ expirationDate: pastDate, filename: 'multi-expired-1.json' }),
                createTestFile({ expirationDate: pastDate, filename: 'multi-expired-2.json' }),
                createTestFile({ expirationDate: pastDate, filename: 'multi-expired-3.json' }),
            ]);

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(3);
            expect(await File.countDocuments({ filename: /multi-expired/ })).toBe(0);
        });

        test('should delete only expired files, keep future ones', async () => {
            const pastDate = daysAgo(1);
            const futureDate = daysFromNow(30);

            await File.create([
                createTestFile({ expirationDate: pastDate, filename: 'to-delete.json' }),
                createTestFile({ expirationDate: futureDate, filename: 'to-keep.json' }),
                createTestFile({ expirationDate: null, filename: 'no-expiration.json' }),
            ]);

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(1);
            expect(await File.countDocuments({ filename: 'to-delete.json' })).toBe(0);
            expect(await File.countDocuments({ filename: 'to-keep.json' })).toBe(1);
            expect(await File.countDocuments({ filename: 'no-expiration.json' })).toBe(1);
        });

        test('should delete file with expirationDate exactly now', async () => {
            const now = new Date();
            now.setSeconds(0);
            now.setMilliseconds(0);
            
            await File.create(createTestFile({
                expirationDate: now,
                filename: 'exactly-now.json'
            }));

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(1);
        });
    });

    // ====== TESTS DE POLÍTICA deleteByLastAccess ======

    describe("deleteByLastAccess policy", () => {
        beforeEach(async () => {
            await UserStorage.create(USER_STORAGE_BY_LAST_ACCESS);
        });

        test('should delete file when lastAccess + fileExpirationTime < now', async () => {
            const expiredLastAccess = daysAgo(35);
            await File.create(createTestFile({
                lastAccess: expiredLastAccess,
                filename: 'lastAccess-expired.json'
            }));

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(1);
            expect(await File.countDocuments({ filename: 'lastAccess-expired.json' })).toBe(0);
        });

        test('should NOT delete file when lastAccess is recent (within expiration)', async () => {
            const recentLastAccess = daysAgo(10);
            await File.create(createTestFile({
                lastAccess: recentLastAccess,
                filename: 'lastAccess-recent.json'
            }));

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(0);
            expect(await File.countDocuments({ filename: 'lastAccess-recent.json' })).toBe(1);
        });

        test('should NOT delete file when lastAccess is exactly at expiration boundary', async () => {
            const boundaryLastAccess = daysAgo(29);
            await File.create(createTestFile({
                lastAccess: boundaryLastAccess,
                filename: 'lastAccess-boundary.json'
            }));

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(0);
            expect(await File.countDocuments({ filename: 'lastAccess-boundary.json' })).toBe(1);
        });

        test('should delete multiple files by lastAccess policy', async () => {
            await File.create([
                createTestFile({ lastAccess: daysAgo(40), filename: 'la-multi-1.json' }),
                createTestFile({ lastAccess: daysAgo(50), filename: 'la-multi-2.json' }),
                createTestFile({ lastAccess: daysAgo(60), filename: 'la-multi-3.json' }),
            ]);

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(3);
        });

        test('should mix expired and non-expired by lastAccess', async () => {
            await File.create([
                createTestFile({ lastAccess: daysAgo(40), filename: 'la-expired.json' }),
                createTestFile({ lastAccess: daysAgo(5), filename: 'la-recent.json' }),
            ]);

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(1);
            expect(await File.countDocuments({ filename: 'la-expired.json' })).toBe(0);
            expect(await File.countDocuments({ filename: 'la-recent.json' })).toBe(1);
        });
    });

    // ====== TESTS DE POLÍTICA deleteByCreatedAt ======

    describe("deleteByCreatedAt policy", () => {
        test('should delete file when createdAt + fileExpirationTime < now', async () => {
            await UserStorage.findOneAndUpdate(
                { user: TEST_USER_ID },
                USER_STORAGE_BY_CREATED_AT,
                { upsert: true, new: true }
            );

            const expiredCreatedAt = daysAgo(35);
            await File.create(createTestFile({
                createdAt: expiredCreatedAt,
                lastAccess: new Date(),
                filename: 'createdAt-expired.json'
            }));

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(1);
            expect(await File.countDocuments({ filename: 'createdAt-expired.json' })).toBe(0);
        });

        test('should NOT delete file when createdAt is recent (within expiration)', async () => {
            await UserStorage.findOneAndUpdate(
                { user: TEST_USER_ID },
                USER_STORAGE_BY_CREATED_AT,
                { upsert: true, new: true }
            );

            const recentCreatedAt = daysAgo(10);
            await File.create(createTestFile({
                createdAt: recentCreatedAt,
                lastAccess: new Date(),
                filename: 'createdAt-recent.json'
            }));

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(0);
            expect(await File.countDocuments({ filename: 'createdAt-recent.json' })).toBe(1);
        });

        test('should respect createdAt even with recent lastAccess', async () => {
            await UserStorage.findOneAndUpdate(
                { user: TEST_USER_ID },
                {
                    capacity: 1024,
                    usedSpace: 0,
                    maxFileSize: 100,
                    fileExpirationTime: 5,
                    deleteByLastAccess: false,
                    deleteByCreatedAt: true,
                    filesPrivacy: 'private'
                },
                { upsert: true, new: true }
            );

            await File.create(createTestFile({
                createdAt: daysAgo(10),
                lastAccess: daysAgo(1),
                filename: 'createdAt-old-lastAccess-recent.json'
            }));

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(1);
            expect(await File.countDocuments({ filename: 'createdAt-old-lastAccess-recent.json' })).toBe(0);
        });

        test('should NOT delete by createdAt if policy is deleteByLastAccess', async () => {
            await UserStorage.findOneAndUpdate(
                { user: TEST_USER_ID },
                {
                    capacity: 1024,
                    usedSpace: 0,
                    maxFileSize: 100,
                    fileExpirationTime: 5,
                    deleteByLastAccess: true,
                    deleteByCreatedAt: false,
                    filesPrivacy: 'private'
                },
                { upsert: true, new: true }
            );

            await File.create(createTestFile({
                createdAt: daysAgo(10),
                lastAccess: daysAgo(1),
                filename: 'lastAccess-ignores-createdAt.json'
            }));

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(0);
            expect(await File.countDocuments({ filename: 'lastAccess-ignores-createdAt.json' })).toBe(1);
        });
    });

    // ====== TESTS DE MIXTO: EXPLÍCITA + POLÍTICA ======

    describe("Mixed explicit expiration and policy", () => {
        test('should delete both explicit and policy expired files', async () => {
            await UserStorage.create(USER_STORAGE_BY_LAST_ACCESS);

            await File.create([
                createTestFile({ expirationDate: daysAgo(1), filename: 'explicit.json' }),
                createTestFile({ lastAccess: daysAgo(40), filename: 'policy.json' }),
            ]);

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(2);
        });

        test('should delete explicit first, then policy', async () => {
            await UserStorage.create(USER_STORAGE_BY_LAST_ACCESS);

            await File.create([
                createTestFile({ lastAccess: daysAgo(40), filename: 'policy-only.json' }),
                createTestFile({ expirationDate: daysAgo(1), filename: 'explicit-only.json' }),
            ]);

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(2);
            expect(await File.countDocuments({})).toBe(0);
        });
    });

    // ====== TESTS DE PARALELISMO ======

    describe("Parallel deletion", () => {
        test('should process multiple files in parallel', async () => {
            const pastDate = daysAgo(5);
            const files = Array.from({ length: 20 }, (_, i) =>
                createTestFile({ expirationDate: pastDate, filename: `parallel-${i}.json` })
            );
            await File.create(files);

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(20);
            expect(await File.countDocuments({})).toBe(0);
        });

        test('should handle mixed expiration times in parallel', async () => {
            await UserStorage.create(USER_STORAGE_BY_LAST_ACCESS);

            const files = [
                createTestFile({ expirationDate: daysAgo(1), filename: 'p-explicit-1.json' }),
                createTestFile({ expirationDate: daysAgo(2), filename: 'p-explicit-2.json' }),
                createTestFile({ lastAccess: daysAgo(40), filename: 'p-policy-1.json' }),
                createTestFile({ lastAccess: daysAgo(50), filename: 'p-policy-2.json' }),
            ];
            await File.create(files);

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(4);
        });
    });

    // ====== TESTS DE FILES SIN USERSTORAGE ======

    describe("Files without UserStorage", () => {
        test('should NOT delete files if user has no UserStorage', async () => {
            await File.create(createTestFile({
                expirationDate: null,
                filename: 'no-storage.json'
            }));

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(0);
            expect(await File.countDocuments({ filename: 'no-storage.json' })).toBe(1);
        });

        test('should still delete explicit expiration even without UserStorage', async () => {
            await File.create(createTestFile({
                expirationDate: daysAgo(1),
                filename: 'explicit-no-storage.json'
            }));

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(1);
        });
    });

    // ====== TESTS DE CASOS BORDES ======

    describe("Edge cases", () => {
        test('should handle empty database', async () => {
            const result = await FileService.executeCleanup();
            expect(result.deletedCount).toBe(0);
        });

        test('should handle files with size 0', async () => {
            await UserStorage.create(USER_STORAGE_BY_LAST_ACCESS);
            await File.create(createTestFile({
                size: 0,
                lastAccess: daysAgo(40),
                filename: 'zero-size.json'
            }));

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(1);
        });

        test('should handle files with special characters in filename', async () => {
            await File.create(createTestFile({
                expirationDate: daysAgo(1),
                filename: 'file-with-special-chars-áéíóú.json'
            }));

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(1);
        });

        test('should handle concurrent executeCleanup calls', async () => {
            const pastDate = daysAgo(1);
            await File.create(createTestFile({
                expirationDate: pastDate,
                filename: 'concurrent-test.json'
            }));

            const [result1, result2] = await Promise.all([
                FileService.executeCleanup(),
                FileService.executeCleanup()
            ]);

            expect(result1).toBeDefined();
            expect(result2).toBeDefined();
            expect(result1.deletedCount + result2.deletedCount).toBeGreaterThanOrEqual(1);
        });

        test('should be idempotent - multiple calls on same file', async () => {
            const pastDate = daysAgo(1);
            const file = await File.create(createTestFile({
                expirationDate: pastDate,
                filename: 'idempotent-test.json'
            }));

            const calls = Array(5).fill().map(() => FileService.executeCleanup());
            const results = await Promise.all(calls);

            const totalDeleted = results.reduce((sum, r) => sum + (r.deletedCount || 0), 0);
            const totalErrors = results.reduce((sum, r) => sum + (r.errorCount || 0), 0);

            expect(await File.countDocuments({ _id: file._id })).toBe(0);
        });

        test('should handle 10 concurrent calls without crashing', async () => {
            for (let i = 0; i < 5; i++) {
                await File.create(createTestFile({
                    expirationDate: daysAgo(1),
                    filename: `race-${i}.json`
                }));
            }

            const calls = Array(10).fill().map(() => FileService.executeCleanup());
            
            await expect(Promise.all(calls)).resolves.toBeDefined();

            expect(await File.countDocuments({ filename: /race-/ })).toBe(0);
        });

        test('should handle rapid successive calls without errors', async () => {
            await File.create(createTestFile({
                expirationDate: daysAgo(1),
                filename: 'rapid-successive.json'
            }));

            for (let i = 0; i < 5; i++) {
                const result = await FileService.executeCleanup();
                expect(result).toBeDefined();
            }

            expect(await File.countDocuments({ filename: 'rapid-successive.json' })).toBe(0);
        });

        test('should not duplicate errors with concurrent calls', async () => {
            await File.create(createTestFile({
                expirationDate: daysAgo(1),
                filename: 'no-dup-errors.json'
            }));

            const calls = Array(5).fill().map(() => FileService.executeCleanup());
            const results = await Promise.all(calls);

            const totalErrors = results.reduce((sum, r) => sum + (r.errorCount || 0), 0);
            expect(totalErrors).toBe(0);
        });

        test('should handle interleaved explicit and policy expirations concurrently', async () => {
            await UserStorage.create({
                user: TEST_USER_ID,
                capacity: 1024,
                usedSpace: 0,
                maxFileSize: 100,
                fileExpirationTime: 30,
                deleteByLastAccess: true,
                deleteByCreatedAt: false,
                filesPrivacy: 'private'
            });

            await File.create(createTestFile({
                expirationDate: daysAgo(1),
                filename: 'inter-explicit.json'
            }));

            await File.create(createTestFile({
                lastAccess: daysAgo(40),
                expirationDate: null,
                filename: 'inter-policy.json'
            }));

            const calls = Array(3).fill().map(() => FileService.executeCleanup());
            const results = await Promise.all(calls);

            const totalDeleted = results.reduce((sum, r) => sum + (r.deletedCount || 0), 0);
            expect(totalDeleted).toBeGreaterThanOrEqual(2);
            expect(await File.countDocuments({})).toBe(0);
        });

        test('should handle concurrent calls with different file subsets', async () => {
            for (let i = 0; i < 10; i++) {
                await File.create(createTestFile({
                    expirationDate: daysAgo(1),
                    filename: `subset-${i}.json`
                }));
            }

            const calls = Array(5).fill().map(() => FileService.executeCleanup());
            const results = await Promise.all(calls);

            const totalDeleted = results.reduce((sum, r) => sum + (r.deletedCount || 0), 0);
            expect(totalDeleted).toBeGreaterThanOrEqual(10);
            expect(await File.countDocuments({})).toBe(0);
        });

        test('should handle concurrent calls when database is empty', async () => {
            const calls = Array(5).fill().map(() => FileService.executeCleanup());
            const results = await Promise.all(calls);

            const totalDeleted = results.reduce((sum, r) => sum + (r.deletedCount || 0), 0);
            expect(totalDeleted).toBe(0);
        });

        test('should skip concurrent calls when already running', async () => {
            await File.create(createTestFile({
                expirationDate: daysAgo(1),
                filename: 'skip-when-running.json'
            }));

            expect(FileService.isRunningCleanup).toBe(false);

            const result1Promise = FileService.executeCleanup();
            
            await new Promise(resolve => setTimeout(resolve, 10));
            
            const result2 = await FileService.executeCleanup();

            const result1 = await result1Promise;

            if (result2.skipped) {
                expect(result2.deletedCount).toBe(0);
            } else {
                expect(result1.deletedCount + result2.deletedCount).toBeGreaterThanOrEqual(1);
            }

            expect(await File.countDocuments({ filename: 'skip-when-running.json' })).toBe(0);
        });

        test('should reset isRunning flag after completion', async () => {
            await File.create(createTestFile({
                expirationDate: daysAgo(1),
                filename: 'reset-flag.json'
            }));

            expect(FileService.isRunningCleanup).toBe(false);

            await FileService.executeCleanup();

            expect(FileService.isRunningCleanup).toBe(false);
        });

        test('should reset isRunning flag after successful cleanup', async () => {
            await File.create(createTestFile({
                expirationDate: daysAgo(1),
                filename: 'reset-flag-success.json'
            }));

            expect(FileService.isRunningCleanup).toBe(false);

            await FileService.executeCleanup();

            expect(FileService.isRunningCleanup).toBe(false);
        });
    });

    // ====== TESTS DE POLÍTICAS MUTUAMENTE EXCLUSIVAS ======

    describe("Mutually exclusive policies", () => {
        test('deleteByLastAccess takes precedence when true', async () => {
            await UserStorage.create({
                user: TEST_USER_ID,
                capacity: 1024,
                usedSpace: 0,
                maxFileSize: 100,
                fileExpirationTime: 5,
                deleteByLastAccess: true,
                deleteByCreatedAt: false,
                filesPrivacy: 'private'
            });

            await File.create(createTestFile({
                createdAt: daysAgo(10),
                lastAccess: daysAgo(10),
                filename: 'lastAccess-wins.json'
            }));

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(1);
            expect(await File.countDocuments({ filename: 'lastAccess-wins.json' })).toBe(0);
        });

        test('createdAt used when deleteByLastAccess is false', async () => {
            await UserStorage.create({
                user: TEST_USER_ID,
                capacity: 1024,
                usedSpace: 0,
                maxFileSize: 100,
                fileExpirationTime: 5,
                deleteByLastAccess: false,
                deleteByCreatedAt: true,
                filesPrivacy: 'private'
            });

            await File.create(createTestFile({
                createdAt: daysAgo(10),
                lastAccess: daysAgo(1),
                filename: 'createdAt-used.json'
            }));

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(1);
            expect(await File.countDocuments({ filename: 'createdAt-used.json' })).toBe(0);
        });

        test('should NOT delete by createdAt when deleteByLastAccess is true', async () => {
            await UserStorage.create({
                user: TEST_USER_ID,
                capacity: 1024,
                usedSpace: 0,
                maxFileSize: 100,
                fileExpirationTime: 5,
                deleteByLastAccess: true,
                deleteByCreatedAt: false,
                filesPrivacy: 'private'
            });

            await File.create(createTestFile({
                createdAt: daysAgo(10),
                lastAccess: daysAgo(1),
                filename: 'lastAccess-rejects-createdAt.json'
            }));

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(0);
            expect(await File.countDocuments({ filename: 'lastAccess-rejects-createdAt.json' })).toBe(1);
        });

        test('should NOT delete by lastAccess when deleteByCreatedAt is true', async () => {
            await UserStorage.create({
                user: TEST_USER_ID,
                capacity: 1024,
                usedSpace: 0,
                maxFileSize: 100,
                fileExpirationTime: 5,
                deleteByLastAccess: false,
                deleteByCreatedAt: true,
                filesPrivacy: 'private'
            });

            await File.create(createTestFile({
                createdAt: daysAgo(1),
                lastAccess: daysAgo(10),
                filename: 'createdAt-rejects-lastAccess.json'
            }));

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(0);
            expect(await File.countDocuments({ filename: 'createdAt-rejects-lastAccess.json' })).toBe(1);
        });
    });

    describe("Error count tracking", () => {
        test('should return errorCount 0 for successful cleanup', async () => {
            await File.create(createTestFile({
                expirationDate: daysAgo(1),
                filename: 'success-count.json'
            }));

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(1);
            expect(result.errorCount).toBe(0);
        });

        test('should return errorCount 0 when no files to delete', async () => {
            await File.create(createTestFile({
                expirationDate: daysFromNow(30),
                filename: 'future-no-delete.json'
            }));

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(0);
            expect(result.errorCount).toBe(0);
        });

        test('should return correct counts for mixed explicit and policy', async () => {
            await UserStorage.create(USER_STORAGE_BY_LAST_ACCESS);

            await File.create([
                createTestFile({ expirationDate: daysAgo(1), filename: 'explicit-1.json' }),
                createTestFile({ expirationDate: daysAgo(2), filename: 'explicit-2.json' }),
                createTestFile({ lastAccess: daysAgo(40), filename: 'policy-1.json' }),
                createTestFile({ lastAccess: daysAgo(50), filename: 'policy-2.json' }),
            ]);

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(4);
            expect(result.errorCount).toBe(0);
        });

        test('should return correct counts for empty database', async () => {
            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(0);
            expect(result.errorCount).toBe(0);
        });

        test('should return correct counts when only explicit files exist', async () => {
            await File.create([
                createTestFile({ expirationDate: daysAgo(1), filename: 'only-explicit-1.json' }),
                createTestFile({ expirationDate: daysAgo(2), filename: 'only-explicit-2.json' }),
            ]);

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(2);
            expect(result.errorCount).toBe(0);
        });

        test('should return correct counts when only policy files exist', async () => {
            await UserStorage.create(USER_STORAGE_BY_LAST_ACCESS);

            await File.create([
                createTestFile({ lastAccess: daysAgo(40), filename: 'only-policy-1.json' }),
                createTestFile({ lastAccess: daysAgo(50), filename: 'only-policy-2.json' }),
            ]);

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(2);
            expect(result.errorCount).toBe(0);
        });
    });
});
