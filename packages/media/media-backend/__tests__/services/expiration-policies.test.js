const File = require('../../src/models/FileModel');
const UserStorage = require('../../src/models/UserStorageModel');
const mongoHandler = require('../utils/mongo-handler');
const FileService = require('../../src/services/FileService').default;
const {
    ObjectId,
    TEST_USER_ID,
    OTHER_USER_ID,
    USER_STORAGE_BY_LAST_ACCESS,
    USER_STORAGE_BY_CREATED_AT,
    createTestFile,
    daysAgo,
    daysFromNow
} = require('../data/test-data');

describe("Expiration Policies - Robust Integration Tests", () => {

    beforeAll(async () => {
        await mongoHandler.connect();
    });

    afterAll(async () => {
        await mongoHandler.closeDatabase();
    });

    beforeEach(async () => {
        await mongoHandler.clearDatabase();
    });

    describe("deleteByLastAccess policy - Robust", () => {
        test('should expire file based on lastAccess, not createdAt', async () => {
            await UserStorage.create({
                user: TEST_USER_ID,
                capacity: 1024,
                usedSpace: 0,
                maxFileSize: 100,
                fileExpirationTime: 10,
                deleteByLastAccess: true,
                deleteByCreatedAt: false,
                filesPrivacy: 'private'
            });

            await File.create(createTestFile({
                createdAt: daysAgo(5),
                lastAccess: daysAgo(15),
                expirationDate: null,
                filename: 'lastAccess-expired.json'
            }));

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(1);
            expect(await File.countDocuments({ filename: 'lastAccess-expired.json' })).toBe(0);
        });

        test('should NOT expire file if lastAccess is within expiration', async () => {
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
                createdAt: daysAgo(60),
                lastAccess: daysAgo(5),
                expirationDate: null,
                filename: 'lastAccess-recent.json'
            }));

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(0);
            expect(await File.countDocuments({ filename: 'lastAccess-recent.json' })).toBe(1);
        });

        test('should delete even when createdAt is older than lastAccess', async () => {
            await UserStorage.create({
                user: TEST_USER_ID,
                capacity: 1024,
                usedSpace: 0,
                maxFileSize: 100,
                fileExpirationTime: 10,
                deleteByLastAccess: true,
                deleteByCreatedAt: false,
                filesPrivacy: 'private'
            });

            await File.create(createTestFile({
                createdAt: daysAgo(50),
                lastAccess: daysAgo(15),
                expirationDate: null,
                filename: 'lastAccess-ignores-createdAt.json'
            }));

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(1);
        });
    });

    describe("deleteByCreatedAt policy - Robust", () => {
        test('should expire file based on createdAt, not lastAccess', async () => {
            await UserStorage.create({
                user: TEST_USER_ID,
                capacity: 1024,
                usedSpace: 0,
                maxFileSize: 100,
                fileExpirationTime: 10,
                deleteByLastAccess: false,
                deleteByCreatedAt: true,
                filesPrivacy: 'private'
            });

            await File.create(createTestFile({
                createdAt: daysAgo(15),
                lastAccess: daysAgo(1),
                expirationDate: null,
                filename: 'createdAt-expired.json'
            }));

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(1);
            expect(await File.countDocuments({ filename: 'createdAt-expired.json' })).toBe(0);
        });

        test('should NOT expire file if createdAt is within expiration', async () => {
            await UserStorage.create({
                user: TEST_USER_ID,
                capacity: 1024,
                usedSpace: 0,
                maxFileSize: 100,
                fileExpirationTime: 30,
                deleteByLastAccess: false,
                deleteByCreatedAt: true,
                filesPrivacy: 'private'
            });

            await File.create(createTestFile({
                createdAt: daysAgo(5),
                lastAccess: daysAgo(60),
                expirationDate: null,
                filename: 'createdAt-recent.json'
            }));

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(0);
            expect(await File.countDocuments({ filename: 'createdAt-recent.json' })).toBe(1);
        });

        test('should delete even when lastAccess is older than createdAt', async () => {
            await UserStorage.create({
                user: TEST_USER_ID,
                capacity: 1024,
                usedSpace: 0,
                maxFileSize: 100,
                fileExpirationTime: 10,
                deleteByLastAccess: false,
                deleteByCreatedAt: true,
                filesPrivacy: 'private'
            });

            await File.create(createTestFile({
                createdAt: daysAgo(15),
                lastAccess: daysAgo(50),
                expirationDate: null,
                filename: 'createdAt-ignores-lastAccess.json'
            }));

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(1);
        });
    });

    describe("Both policies enabled (edge case)", () => {
        test('should use lastAccess when both deleteByLastAccess and deleteByCreatedAt are true', async () => {
            await UserStorage.create({
                user: TEST_USER_ID,
                capacity: 1024,
                usedSpace: 0,
                maxFileSize: 100,
                fileExpirationTime: 10,
                deleteByLastAccess: true,
                deleteByCreatedAt: true,
                filesPrivacy: 'private'
            });

            await File.create(createTestFile({
                createdAt: daysAgo(5),
                lastAccess: daysAgo(15),
                expirationDate: null,
                filename: 'both-true-expired-by-lastAccess.json'
            }));

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(1);
            expect(await File.countDocuments({ filename: 'both-true-expired-by-lastAccess.json' })).toBe(0);
        });

        test('should NOT delete when both policies true but file is recent', async () => {
            await UserStorage.create({
                user: TEST_USER_ID,
                capacity: 1024,
                usedSpace: 0,
                maxFileSize: 100,
                fileExpirationTime: 10,
                deleteByLastAccess: true,
                deleteByCreatedAt: true,
                filesPrivacy: 'private'
            });

            await File.create(createTestFile({
                createdAt: daysAgo(15),
                lastAccess: daysAgo(5),
                expirationDate: null,
                filename: 'both-true-recent.json'
            }));

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(0);
            expect(await File.countDocuments({ filename: 'both-true-recent.json' })).toBe(1);
        });
    });

    describe("Both policies disabled (edge case)", () => {
        test('should use createdAt when both deleteByLastAccess and deleteByCreatedAt are false', async () => {
            await UserStorage.create({
                user: TEST_USER_ID,
                capacity: 1024,
                usedSpace: 0,
                maxFileSize: 100,
                fileExpirationTime: 10,
                deleteByLastAccess: false,
                deleteByCreatedAt: false,
                filesPrivacy: 'private'
            });

            await File.create(createTestFile({
                createdAt: daysAgo(15),
                lastAccess: daysAgo(5),
                expirationDate: null,
                filename: 'both-false-expired-by-createdAt.json'
            }));

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(1);
            expect(await File.countDocuments({ filename: 'both-false-expired-by-createdAt.json' })).toBe(0);
        });

        test('should NOT delete when both policies false but file is recent', async () => {
            await UserStorage.create({
                user: TEST_USER_ID,
                capacity: 1024,
                usedSpace: 0,
                maxFileSize: 100,
                fileExpirationTime: 10,
                deleteByLastAccess: false,
                deleteByCreatedAt: false,
                filesPrivacy: 'private'
            });

            await File.create(createTestFile({
                createdAt: daysAgo(5),
                lastAccess: daysAgo(15),
                expirationDate: null,
                filename: 'both-false-recent.json'
            }));

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(0);
            expect(await File.countDocuments({ filename: 'both-false-recent.json' })).toBe(1);
        });
    });

    describe("Mutually exclusive policies - Robust", () => {
        test('lastAccess should be used when deleteByLastAccess = true', async () => {
            await UserStorage.create({
                user: TEST_USER_ID,
                capacity: 1024,
                usedSpace: 0,
                maxFileSize: 100,
                fileExpirationTime: 10,
                deleteByLastAccess: true,
                deleteByCreatedAt: false,
                filesPrivacy: 'private'
            });

            await File.create(createTestFile({
                createdAt: daysAgo(60),
                lastAccess: daysAgo(5),
                expirationDate: null,
                filename: 'excl-lastAccess.json'
            }));

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(0);
            expect(await File.countDocuments({ filename: 'excl-lastAccess.json' })).toBe(1);
        });

        test('createdAt should be used when deleteByLastAccess = false', async () => {
            await UserStorage.create({
                user: TEST_USER_ID,
                capacity: 1024,
                usedSpace: 0,
                maxFileSize: 100,
                fileExpirationTime: 10,
                deleteByLastAccess: false,
                deleteByCreatedAt: true,
                filesPrivacy: 'private'
            });

            await File.create(createTestFile({
                createdAt: daysAgo(60),
                lastAccess: daysAgo(5),
                expirationDate: null,
                filename: 'excl-createdAt.json'
            }));

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(1);
            expect(await File.countDocuments({ filename: 'excl-createdAt.json' })).toBe(0);
        });

        test('should correctly apply different policies to different files', async () => {
            await UserStorage.create({
                user: TEST_USER_ID,
                capacity: 1024,
                usedSpace: 0,
                maxFileSize: 100,
                fileExpirationTime: 10,
                deleteByLastAccess: true,
                deleteByCreatedAt: false,
                filesPrivacy: 'private'
            });

            await UserStorage.create({
                user: OTHER_USER_ID,
                capacity: 1024,
                usedSpace: 0,
                maxFileSize: 100,
                fileExpirationTime: 10,
                deleteByLastAccess: false,
                deleteByCreatedAt: true,
                filesPrivacy: 'private'
            });

            await File.create({
                ...createTestFile({
                    _id: new ObjectId(),
                    createdBy: { user: TEST_USER_ID, username: 'user1' },
                    createdAt: daysAgo(60),
                    lastAccess: daysAgo(5),
                    expirationDate: null,
                    filename: 'user1-file.json'
                })
            });

            await File.create({
                ...createTestFile({
                    _id: new ObjectId(),
                    createdBy: { user: OTHER_USER_ID, username: 'user2' },
                    createdAt: daysAgo(15),
                    lastAccess: daysAgo(1),
                    expirationDate: null,
                    filename: 'user2-file.json'
                })
            });

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(1);
            expect(await File.countDocuments({ filename: 'user1-file.json' })).toBe(1);
            expect(await File.countDocuments({ filename: 'user2-file.json' })).toBe(0);
        });
    });

    describe("Different fileExpirationTime values - Robust", () => {
        test('should respect custom fileExpirationTime of 5 days', async () => {
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
                lastAccess: daysAgo(6),
                expirationDate: null,
                filename: '5days-expired.json'
            }));
            await File.create(createTestFile({
                lastAccess: daysAgo(4),
                expirationDate: null,
                filename: '5days-recent.json'
            }));

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(1);
            expect(await File.countDocuments({ filename: '5days-expired.json' })).toBe(0);
            expect(await File.countDocuments({ filename: '5days-recent.json' })).toBe(1);
        });

        test('should respect custom fileExpirationTime of 365 days', async () => {
            await UserStorage.create({
                user: TEST_USER_ID,
                capacity: 1024,
                usedSpace: 0,
                maxFileSize: 100,
                fileExpirationTime: 365,
                deleteByLastAccess: true,
                deleteByCreatedAt: false,
                filesPrivacy: 'private'
            });

            await File.create(createTestFile({
                lastAccess: daysAgo(100),
                expirationDate: null,
                filename: '365days-recent.json'
            }));

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(0);
            expect(await File.countDocuments({ filename: '365days-recent.json' })).toBe(1);
        });

        test('should respect custom fileExpirationTime of 1 day', async () => {
            await UserStorage.create({
                user: TEST_USER_ID,
                capacity: 1024,
                usedSpace: 0,
                maxFileSize: 100,
                fileExpirationTime: 1,
                deleteByLastAccess: true,
                deleteByCreatedAt: false,
                filesPrivacy: 'private'
            });

            await File.create(createTestFile({
                lastAccess: daysAgo(2),
                expirationDate: null,
                filename: '1day-expired.json'
            }));

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(1);
            expect(await File.countDocuments({ filename: '1day-expired.json' })).toBe(0);
        });

        test('should respect custom fileExpirationTime of 90 days', async () => {
            await UserStorage.create({
                user: TEST_USER_ID,
                capacity: 1024,
                usedSpace: 0,
                maxFileSize: 100,
                fileExpirationTime: 90,
                deleteByLastAccess: true,
                deleteByCreatedAt: false,
                filesPrivacy: 'private'
            });

            await File.create(createTestFile({
                lastAccess: daysAgo(100),
                expirationDate: null,
                filename: '90days-expired.json'
            }));
            await File.create(createTestFile({
                lastAccess: daysAgo(80),
                expirationDate: null,
                filename: '90days-recent.json'
            }));

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(1);
            expect(await File.countDocuments({ filename: '90days-expired.json' })).toBe(0);
            expect(await File.countDocuments({ filename: '90days-recent.json' })).toBe(1);
        });
    });

    describe("Multiple users with different policies - Robust", () => {
        test('should apply correct policy per user', async () => {
            await UserStorage.create({
                user: TEST_USER_ID,
                capacity: 1024,
                usedSpace: 0,
                maxFileSize: 100,
                fileExpirationTime: 10,
                deleteByLastAccess: true,
                deleteByCreatedAt: false,
                filesPrivacy: 'private'
            });

            await UserStorage.create({
                user: OTHER_USER_ID,
                capacity: 1024,
                usedSpace: 0,
                maxFileSize: 100,
                fileExpirationTime: 10,
                deleteByLastAccess: false,
                deleteByCreatedAt: true,
                filesPrivacy: 'private'
            });

            await File.create({
                ...createTestFile({
                    _id: new ObjectId(),
                    createdBy: { user: TEST_USER_ID, username: 'testuser' },
                    createdAt: daysAgo(15),
                    lastAccess: daysAgo(15),
                    expirationDate: null,
                    filename: 'user1-file.json'
                })
            });

            await File.create({
                ...createTestFile({
                    _id: new ObjectId(),
                    createdBy: { user: OTHER_USER_ID, username: 'otheruser' },
                    createdAt: daysAgo(15),
                    lastAccess: daysAgo(5),
                    expirationDate: null,
                    filename: 'user2-file.json'
                })
            });

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(2);
            expect(await File.countDocuments({ filename: 'user1-file.json' })).toBe(0);
            expect(await File.countDocuments({ filename: 'user2-file.json' })).toBe(0);
        });

        test('should delete all expired files across different policies', async () => {
            await UserStorage.create({
                user: TEST_USER_ID,
                capacity: 1024,
                usedSpace: 0,
                maxFileSize: 100,
                fileExpirationTime: 10,
                deleteByLastAccess: true,
                deleteByCreatedAt: false,
                filesPrivacy: 'private'
            });

            await UserStorage.create({
                user: OTHER_USER_ID,
                capacity: 1024,
                usedSpace: 0,
                maxFileSize: 100,
                fileExpirationTime: 10,
                deleteByLastAccess: false,
                deleteByCreatedAt: true,
                filesPrivacy: 'private'
            });

            await File.create({
                ...createTestFile({
                    _id: new ObjectId(),
                    createdBy: { user: TEST_USER_ID, username: 'testuser' },
                    lastAccess: daysAgo(15),
                    expirationDate: null,
                    filename: 'both-user1.json'
                })
            });

            await File.create({
                ...createTestFile({
                    _id: new ObjectId(),
                    createdBy: { user: OTHER_USER_ID, username: 'otheruser' },
                    createdAt: daysAgo(15),
                    lastAccess: daysAgo(1),
                    expirationDate: null,
                    filename: 'both-user2.json'
                })
            });

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(2);
            expect(await File.countDocuments({})).toBe(0);
        });

        test('should keep recent files from both users', async () => {
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

            await UserStorage.create({
                user: OTHER_USER_ID,
                capacity: 1024,
                usedSpace: 0,
                maxFileSize: 100,
                fileExpirationTime: 30,
                deleteByLastAccess: false,
                deleteByCreatedAt: true,
                filesPrivacy: 'private'
            });

            await File.create({
                ...createTestFile({
                    _id: new ObjectId(),
                    createdBy: { user: TEST_USER_ID, username: 'testuser' },
                    lastAccess: daysAgo(5),
                    expirationDate: null,
                    filename: 'recent-user1.json'
                })
            });

            await File.create({
                ...createTestFile({
                    _id: new ObjectId(),
                    createdBy: { user: OTHER_USER_ID, username: 'otheruser' },
                    createdAt: daysAgo(5),
                    lastAccess: daysAgo(1),
                    expirationDate: null,
                    filename: 'recent-user2.json'
                })
            });

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(0);
            expect(await File.countDocuments({ filename: /recent-user/ })).toBe(2);
        });
    });

    describe("Edge cases with policies - Robust", () => {
        test('should handle fileExpirationTime = 0', async () => {
            await UserStorage.create({
                user: TEST_USER_ID,
                capacity: 1024,
                usedSpace: 0,
                maxFileSize: 100,
                fileExpirationTime: 0,
                deleteByLastAccess: true,
                deleteByCreatedAt: false,
                filesPrivacy: 'private'
            });

            await File.create(createTestFile({
                lastAccess: daysAgo(1),
                expirationDate: null,
                filename: 'zero-expiry.json'
            }));

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(1);
            expect(await File.countDocuments({ filename: 'zero-expiry.json' })).toBe(0);
        });

        test('should handle file with lastAccess at exact boundary', async () => {
            await UserStorage.create({
                user: TEST_USER_ID,
                capacity: 1024,
                usedSpace: 0,
                maxFileSize: 100,
                fileExpirationTime: 10,
                deleteByLastAccess: true,
                deleteByCreatedAt: false,
                filesPrivacy: 'private'
            });

            const boundaryDate = new Date();
            boundaryDate.setDate(boundaryDate.getDate() - 10);
            boundaryDate.setHours(boundaryDate.getHours() - 1);

            await File.create(createTestFile({
                lastAccess: boundaryDate,
                expirationDate: null,
                filename: 'boundary-exact.json'
            }));

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(1);
        });

        test('should handle file with lastAccess just inside boundary', async () => {
            await UserStorage.create({
                user: TEST_USER_ID,
                capacity: 1024,
                usedSpace: 0,
                maxFileSize: 100,
                fileExpirationTime: 10,
                deleteByLastAccess: true,
                deleteByCreatedAt: false,
                filesPrivacy: 'private'
            });

            const safeDate = new Date();
            safeDate.setDate(safeDate.getDate() - 9);
            safeDate.setHours(safeDate.getHours() - 23);

            await File.create(createTestFile({
                lastAccess: safeDate,
                expirationDate: null,
                filename: 'boundary-safe.json'
            }));

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(0);
            expect(await File.countDocuments({ filename: 'boundary-safe.json' })).toBe(1);
        });

        test('should handle file with lastAccess defaulting to now', async () => {
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
                lastAccess: new Date(),
                expirationDate: null,
                filename: 'default-lastAccess.json'
            }));

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(0);
            expect(await File.countDocuments({ filename: 'default-lastAccess.json' })).toBe(1);
        });
    });

    describe("Explicit expiration takes precedence over policy", () => {
        test('should delete explicit expiration even if policy would not', async () => {
            await UserStorage.create({
                user: TEST_USER_ID,
                capacity: 1024,
                usedSpace: 0,
                maxFileSize: 100,
                fileExpirationTime: 365,
                deleteByLastAccess: true,
                deleteByCreatedAt: false,
                filesPrivacy: 'private'
            });

            await File.create(createTestFile({
                expirationDate: daysAgo(1),
                lastAccess: daysAgo(5),
                filename: 'explicit-overrides-policy.json'
            }));

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(1);
            expect(await File.countDocuments({ filename: 'explicit-overrides-policy.json' })).toBe(0);
        });

        test('should keep file with future explicit expiration even if policy expired', async () => {
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
                expirationDate: daysFromNow(10),
                lastAccess: daysAgo(10),
                filename: 'explicit-protects.json'
            }));

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(0);
            expect(await File.countDocuments({ filename: 'explicit-protects.json' })).toBe(1);
        });

        test('should process explicit and policy in same cleanup run', async () => {
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

            await File.create([
                createTestFile({ expirationDate: daysAgo(1), filename: 'explicit-1.json' }),
                createTestFile({ expirationDate: daysAgo(5), filename: 'explicit-2.json' }),
                createTestFile({ lastAccess: daysAgo(40), filename: 'policy-1.json' }),
                createTestFile({ lastAccess: daysAgo(60), filename: 'policy-2.json' }),
            ]);

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(4);
            expect(await File.countDocuments({})).toBe(0);
        });
    });
});
