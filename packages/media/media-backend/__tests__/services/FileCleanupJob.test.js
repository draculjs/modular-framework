const mongoose = require('mongoose');
const File = require('../../src/models/FileModel');
const UserStorage = require('../../src/models/UserStorageModel');
const mongoHandler = require('../utils/mongo-handler');
const FileCleanupJob = require('../../src/services/FileCleanupJob');
const FileService = require('../../src/services/FileService').default;
const DistributedLock = require('../../src/services/helpers/DistributedLock').default;
const { LOCK_COLLECTION, LOCK_TIMEOUT_MS } = require('../../src/services/helpers/DistributedLock');
const {
    TEST_USER_ID,
    OTHER_USER_ID,
    USER_STORAGE_BY_LAST_ACCESS,
    createTestFile,
    daysAgo,
    daysFromNow,
    hoursFromNow
} = require('../data/test-data');

describe("FileCleanupJob - Integration Tests", () => {
    let originalEnv;

    beforeAll(async () => {
        await mongoHandler.connect();
    });

    afterAll(async () => {
        await mongoHandler.closeDatabase();
    });

    beforeEach(async () => {
        await mongoHandler.clearDatabase();
        await UserStorage.create(USER_STORAGE_BY_LAST_ACCESS);
        originalEnv = { ...process.env };
    });

    afterEach(async () => {
        process.env = { ...originalEnv };
        FileCleanupJob.stopFileCleanupJob();
    });

    describe("startFileCleanupJob", () => {
        test('should initialize scheduler with correct exports', () => {
            expect(FileCleanupJob).toBeDefined();
            expect(typeof FileCleanupJob.startFileCleanupJob).toBe('function');
            expect(typeof FileCleanupJob.stopFileCleanupJob).toBe('function');
            expect(typeof (FileCleanupJob.default?.execute || FileCleanupJob.execute)).toBe('function');

            FileCleanupJob.stopFileCleanupJob();
            expect(() => FileCleanupJob.startFileCleanupJob({ enabled: true })).not.toThrow();
            expect(() => FileCleanupJob.stopFileCleanupJob()).not.toThrow();
        });

        test('should execute cleanup when scheduler is enabled', async () => {
            await File.create(createTestFile({
                expirationDate: daysAgo(1),
                filename: 'scheduler-enabled-test.json'
            }));

            const beforeCount = await File.countDocuments({ filename: 'scheduler-enabled-test.json' });
            expect(beforeCount).toBe(1);

            await FileService.executeCleanup();

            const afterCount = await File.countDocuments({ filename: 'scheduler-enabled-test.json' });
            expect(afterCount).toBe(0);
        });

        test('should maintain consistent state on multiple starts', async () => {
            FileCleanupJob.startFileCleanupJob({ enabled: true });
            FileCleanupJob.startFileCleanupJob({ enabled: true });
            FileCleanupJob.startFileCleanupJob({ enabled: true });

            await File.create(createTestFile({
                expirationDate: daysAgo(1),
                filename: 'multiple-starts.json'
            }));

            await FileService.executeCleanup();

            expect(await File.countDocuments({ filename: 'multiple-starts.json' })).toBe(0);

            FileCleanupJob.stopFileCleanupJob();
        });
    });

    describe("stopFileCleanupJob", () => {
        test('should stop scheduler and allow restart', async () => {
            FileCleanupJob.startFileCleanupJob({ enabled: true });
            FileCleanupJob.stopFileCleanupJob();
            FileCleanupJob.stopFileCleanupJob();

            expect(() => FileCleanupJob.startFileCleanupJob({ enabled: true })).not.toThrow();

            await File.create(createTestFile({
                expirationDate: daysAgo(1),
                filename: 'restart-test.json'
            }));

            await FileService.executeCleanup();

            expect(await File.countDocuments({ filename: 'restart-test.json' })).toBe(0);

            FileCleanupJob.stopFileCleanupJob();
        });
    });

    describe("Cleanup with scheduler", () => {
        test('should delete expired files when scheduler runs', async () => {
            await File.create(createTestFile({
                expirationDate: daysAgo(5),
                filename: 'job-expired.json'
            }));

            const beforeCount = await File.countDocuments({ filename: 'job-expired.json' });
            expect(beforeCount).toBe(1);

            await FileService.executeCleanup();

            const afterCount = await File.countDocuments({ filename: 'job-expired.json' });
            expect(afterCount).toBe(0);
        });

        test('should not delete non-expired files', async () => {
            await File.create(createTestFile({
                expirationDate: daysFromNow(30),
                filename: 'job-future.json'
            }));

            await FileService.executeCleanup();

            const afterCount = await File.countDocuments({ filename: 'job-future.json' });
            expect(afterCount).toBe(1);
        });
    });

    describe("Scheduling logic", () => {
        test('should calculate correct delay for next expiration', async () => {
            const futureDate = daysFromNow(5);
            await File.create(createTestFile({
                expirationDate: futureDate,
                filename: 'future-delay.json'
            }));

            const nextTs = await FileService.getNextExpirationTimestamp();

            expect(nextTs).not.toBeNull();
            expect(nextTs).toBeGreaterThan(Date.now());
            expect(nextTs).toBeLessThanOrEqual(futureDate.getTime());
        });

        test('should return null when no future expirations', async () => {
            await File.create(createTestFile({
                expirationDate: daysAgo(1),
                filename: 'past.json'
            }));

            const nextTs = await FileService.getNextExpirationTimestamp();

            expect(nextTs).toBeNull();
        });

        test('should return null for empty database', async () => {
            const nextTs = await FileService.getNextExpirationTimestamp();
            expect(nextTs).toBeNull();
        });
    });
});

describe("FileCleanupJob - Robust Integration Tests", () => {
    let originalEnv;

    beforeAll(async () => {
        await mongoHandler.connect();
    });

    afterAll(async () => {
        await mongoHandler.closeDatabase();
    });

    beforeEach(async () => {
        await mongoHandler.clearDatabase();
        originalEnv = { ...process.env };
    });

    afterEach(async () => {
        process.env = { ...originalEnv };
        FileCleanupJob.stopFileCleanupJob();
    });

    describe("Scheduler behavior", () => {
        test('should reschedule after execution', async () => {
            await File.create(createTestFile({
                expirationDate: daysAgo(1),
                filename: 'reschedule.json'
            }));

            const result = await FileService.executeCleanup();
            expect(result.deletedCount).toBe(1);

            const remaining = await File.countDocuments({ filename: 'reschedule.json' });
            expect(remaining).toBe(0);
        });

        test('should handle scheduler with multiple expired files', async () => {
            await File.create([
                createTestFile({ expirationDate: daysAgo(5), filename: 'multi-exp-1.json' }),
                createTestFile({ expirationDate: daysAgo(3), filename: 'multi-exp-2.json' }),
                createTestFile({ expirationDate: daysAgo(1), filename: 'multi-exp-3.json' }),
            ]);

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(3);
            expect(await File.countDocuments({})).toBe(0);
        });

        test('should handle scheduler with mixed expiration times', async () => {
            await UserStorage.create({
                ...USER_STORAGE_BY_LAST_ACCESS,
                user: TEST_USER_ID
            });

            await File.create([
                createTestFile({ expirationDate: daysAgo(1), filename: 'explicit-exp.json' }),
                createTestFile({ lastAccess: daysAgo(40), filename: 'policy-exp.json' }),
                createTestFile({ expirationDate: daysFromNow(30), filename: 'future.json' }),
            ]);

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(2);
            expect(await File.countDocuments({ filename: 'future.json' })).toBe(1);
        });
    });

    describe("Multiple users and policies", () => {
        test('should handle multiple users with different policies', async () => {
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
                fileExpirationTime: 20,
                deleteByLastAccess: false,
                deleteByCreatedAt: true,
                filesPrivacy: 'private'
            });

            await File.create([
                createTestFile({
                    _id: require('mongoose').Types.ObjectId(),
                    createdBy: { user: TEST_USER_ID, username: 'user1' },
                    lastAccess: daysAgo(15),
                    expirationDate: null,
                    filename: 'user1-expired.json'
                }),
                createTestFile({
                    _id: require('mongoose').Types.ObjectId(),
                    createdBy: { user: OTHER_USER_ID, username: 'user2' },
                    createdAt: daysAgo(25),
                    lastAccess: daysAgo(1),
                    expirationDate: null,
                    filename: 'user2-expired.json'
                }),
                createTestFile({
                    _id: require('mongoose').Types.ObjectId(),
                    createdBy: { user: TEST_USER_ID, username: 'user1' },
                    lastAccess: daysAgo(5),
                    expirationDate: null,
                    filename: 'user1-recent.json'
                }),
                createTestFile({
                    _id: require('mongoose').Types.ObjectId(),
                    createdBy: { user: OTHER_USER_ID, username: 'user2' },
                    createdAt: daysAgo(5),
                    lastAccess: daysAgo(1),
                    expirationDate: null,
                    filename: 'user2-recent.json'
                }),
            ]);

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(2);
            expect(await File.countDocuments({ filename: 'user1-expired.json' })).toBe(0);
            expect(await File.countDocuments({ filename: 'user2-expired.json' })).toBe(0);
            expect(await File.countDocuments({ filename: 'user1-recent.json' })).toBe(1);
            expect(await File.countDocuments({ filename: 'user2-recent.json' })).toBe(1);
        });
    });

    describe("Event-driven rescheduling", () => {
        test('should emit expirationChanged when policy-based file near expiration is accessed', async () => {
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

            const nearExpirationDate = new Date();
            nearExpirationDate.setHours(nearExpirationDate.getHours() + 23);

            await File.create(createTestFile({
                expirationDate: null,
                lastAccess: hoursFromNow(-23),
                filename: 'event-test-policy-near.json'
            }));

            let eventFired = false;
            FileService.on('expirationChanged', () => {
                eventFired = true;
            });

            await FileService.updateByRelativePath(
                (await File.findOne({ filename: 'event-test-policy-near.json' })).relativePath
            );

            expect(eventFired).toBe(true);

            FileService.removeAllListeners('expirationChanged');
        });
    });
});

describe("FileCleanupJob - Edge Cases", () => {
    let originalEnv;

    beforeAll(async () => {
        await mongoHandler.connect();
    });

    afterAll(async () => {
        await mongoHandler.closeDatabase();
    });

    beforeEach(async () => {
        await mongoHandler.clearDatabase();
        originalEnv = { ...process.env };
    });

    afterEach(async () => {
        process.env = { ...originalEnv };
        FileCleanupJob.stopFileCleanupJob();
    });

    describe("Files without UserStorage", () => {
        test('should only delete explicit expiration for files without UserStorage', async () => {
            await File.create(createTestFile({
                expirationDate: daysAgo(1),
                filename: 'explicit-no-storage.json'
            }));

            await File.create(createTestFile({
                lastAccess: daysAgo(40),
                filename: 'policy-no-storage.json'
            }));

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(1);
            expect(await File.countDocuments({ filename: 'explicit-no-storage.json' })).toBe(0);
            expect(await File.countDocuments({ filename: 'policy-no-storage.json' })).toBe(1);
        });

        test('should keep files without expiration when no UserStorage', async () => {
            await File.create(createTestFile({
                expirationDate: null,
                filename: 'no-expiry-no-storage.json'
            }));

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(0);
            expect(await File.countDocuments({ filename: 'no-expiry-no-storage.json' })).toBe(1);
        });
    });

    describe("Files with explicit expirationDate", () => {
        test('should delete file with past expirationDate regardless of UserStorage', async () => {
            await File.create(createTestFile({
                expirationDate: daysAgo(1),
                filename: 'explicit-past.json'
            }));

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(1);
            expect(await File.countDocuments({ filename: 'explicit-past.json' })).toBe(0);
        });

        test('should keep file with future expirationDate', async () => {
            await File.create(createTestFile({
                expirationDate: daysFromNow(10),
                filename: 'explicit-future.json'
            }));

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(0);
            expect(await File.countDocuments({ filename: 'explicit-future.json' })).toBe(1);
        });

        test('should keep file with null expirationDate when UserStorage exists', async () => {
            await UserStorage.create(USER_STORAGE_BY_LAST_ACCESS);

            await File.create(createTestFile({
                expirationDate: null,
                lastAccess: daysAgo(5),
                filename: 'null-expiry-recent.json'
            }));

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(0);
            expect(await File.countDocuments({ filename: 'null-expiry-recent.json' })).toBe(1);
        });
    });

    describe("Policy expiration boundaries", () => {
        test('should delete file at exact expiration boundary (lastAccess)', async () => {
            await UserStorage.create({
                ...USER_STORAGE_BY_LAST_ACCESS,
                fileExpirationTime: 30
            });

            const boundaryDate = new Date();
            boundaryDate.setDate(boundaryDate.getDate() - 30);
            boundaryDate.setHours(boundaryDate.getHours() - 1);

            await File.create(createTestFile({
                lastAccess: boundaryDate,
                expirationDate: null,
                filename: 'boundary-expired.json'
            }));

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(1);
        });

        test('should keep file just before expiration boundary', async () => {
            await UserStorage.create({
                ...USER_STORAGE_BY_LAST_ACCESS,
                fileExpirationTime: 30
            });

            const safeDate = new Date();
            safeDate.setDate(safeDate.getDate() - 29);

            await File.create(createTestFile({
                lastAccess: safeDate,
                expirationDate: null,
                filename: 'boundary-safe.json'
            }));

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(0);
            expect(await File.countDocuments({ filename: 'boundary-safe.json' })).toBe(1);
        });

        test('should delete immediately when fileExpirationTime is 0', async () => {
            await UserStorage.create({
                ...USER_STORAGE_BY_LAST_ACCESS,
                fileExpirationTime: 0
            });

            await File.create(createTestFile({
                lastAccess: new Date(),
                expirationDate: null,
                filename: 'zero-expiry.json'
            }));

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(1);
        });
    });

    describe("Mixed explicit and policy", () => {
        test('should process both explicit and policy in same run', async () => {
            await UserStorage.create(USER_STORAGE_BY_LAST_ACCESS);

            await File.create([
                createTestFile({ expirationDate: daysAgo(1), filename: 'both-explicit.json' }),
                createTestFile({ lastAccess: daysAgo(40), filename: 'both-policy.json' }),
            ]);

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(2);
            expect(await File.countDocuments({})).toBe(0);
        });

        test('should prioritize explicit over policy (different files)', async () => {
            await UserStorage.create(USER_STORAGE_BY_LAST_ACCESS);

            const explicitFile = await File.create(createTestFile({
                expirationDate: daysAgo(5),
                filename: 'priority-explicit.json'
            }));

            const policyFile = await File.create(createTestFile({
                lastAccess: daysAgo(40),
                filename: 'priority-policy.json'
            }));

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(2);
            expect(await File.countDocuments({})).toBe(0);
        });
    });
});

describe("UserStorage Policy Update - Event Emission Tests", () => {
    const UserStorageService = require('../../src/services/UserStorageService');

    beforeAll(async () => {
        await mongoHandler.connect();
    });

    afterAll(async () => {
        await mongoHandler.closeDatabase();
    });

    beforeEach(async () => {
        await mongoHandler.clearDatabase();
    });

    describe("expirationChanged event emission", () => {
        test('should emit expirationChanged when UserStorage policy is updated', async () => {
            const userStorage = await UserStorage.create({
                user: TEST_USER_ID,
                capacity: 1024,
                usedSpace: 0,
                maxFileSize: 100,
                fileExpirationTime: 30,
                deleteByLastAccess: true,
                deleteByCreatedAt: false,
                filesPrivacy: 'private'
            });

            let eventFired = false;
            FileService.on('expirationChanged', () => {
                eventFired = true;
            });

            await UserStorageService.updateUserStorage(
                { id: TEST_USER_ID },
                userStorage._id,
                {
                    capacity: 1024,
                    usedSpace: 0,
                    maxFileSize: 100,
                    fileExpirationTime: 30,
                    deleteByLastAccess: false,
                    deleteByCreatedAt: true,
                    filesPrivacy: 'private'
                }
            );

            expect(eventFired).toBe(true);

            FileService.removeAllListeners('expirationChanged');
        });

        test('should emit expirationChanged when fileExpirationTime is updated', async () => {
            const userStorage = await UserStorage.create({
                user: TEST_USER_ID,
                capacity: 1024,
                usedSpace: 0,
                maxFileSize: 100,
                fileExpirationTime: 30,
                deleteByLastAccess: true,
                deleteByCreatedAt: false,
                filesPrivacy: 'private'
            });

            let eventFired = false;
            FileService.on('expirationChanged', () => {
                eventFired = true;
            });

            await UserStorageService.updateUserStorage(
                { id: TEST_USER_ID },
                userStorage._id,
                {
                    capacity: 1024,
                    usedSpace: 0,
                    maxFileSize: 100,
                    fileExpirationTime: 5,
                    deleteByLastAccess: true,
                    deleteByCreatedAt: false,
                    filesPrivacy: 'private'
                }
            );

            expect(eventFired).toBe(true);

            FileService.removeAllListeners('expirationChanged');
        });

        test('should emit expirationChanged regardless of which field is updated', async () => {
            const userStorage = await UserStorage.create({
                user: TEST_USER_ID,
                capacity: 1024,
                usedSpace: 0,
                maxFileSize: 100,
                fileExpirationTime: 30,
                deleteByLastAccess: true,
                deleteByCreatedAt: false,
                filesPrivacy: 'private'
            });

            let eventFired = false;
            FileService.on('expirationChanged', () => {
                eventFired = true;
            });

            await UserStorageService.updateUserStorage(
                { id: TEST_USER_ID },
                userStorage._id,
                {
                    capacity: 2048,
                    usedSpace: 0,
                    maxFileSize: 100,
                    fileExpirationTime: 30,
                    deleteByLastAccess: true,
                    deleteByCreatedAt: false,
                    filesPrivacy: 'private'
                }
            );

            expect(eventFired).toBe(true);

            FileService.removeAllListeners('expirationChanged');
        });
    });

    describe("Policy change triggers cleanup rescheduling", () => {
        test('should trigger cleanup after policy change from lastAccess to createdAt', async () => {
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
                createdAt: daysAgo(5),
                lastAccess: new Date(),
                expirationDate: null,
                filename: 'policy-change-test.json'
            }));

            expect(await File.countDocuments({ filename: 'policy-change-test.json' })).toBe(1);

            const userStorage = await UserStorage.findOne({ user: TEST_USER_ID });
            
            await UserStorageService.updateUserStorage(
                { id: TEST_USER_ID },
                userStorage._id,
                {
                    capacity: 1024,
                    usedSpace: 0,
                    maxFileSize: 100,
                    fileExpirationTime: 1,
                    deleteByLastAccess: false,
                    deleteByCreatedAt: true,
                    filesPrivacy: 'private'
                }
            );

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(1);
            expect(await File.countDocuments({ filename: 'policy-change-test.json' })).toBe(0);
        });

        test('should delete file immediately after policy change with short expiration', async () => {
            const userStorage = await UserStorage.create({
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
                createdAt: daysAgo(10),
                lastAccess: new Date(),
                expirationDate: null,
                filename: 'immediate-delete-test.json'
            }));

            expect(await File.countDocuments({ filename: 'immediate-delete-test.json' })).toBe(1);

            await UserStorageService.updateUserStorage(
                { id: TEST_USER_ID },
                userStorage._id,
                {
                    capacity: 1024,
                    usedSpace: 0,
                    maxFileSize: 100,
                    fileExpirationTime: 1,
                    deleteByLastAccess: false,
                    deleteByCreatedAt: true,
                    filesPrivacy: 'private'
                }
            );

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(1);
            expect(await File.countDocuments({ filename: 'immediate-delete-test.json' })).toBe(0);
        });
    });
});

describe("FileCleanupJob - Distributed Lock Integration", () => {
    beforeAll(async () => {
        await mongoHandler.connect();
    });

    afterAll(async () => {
        await mongoHandler.closeDatabase();
    });

    beforeEach(async () => {
        await mongoHandler.clearDatabase();
        const db = mongoose.connection.db;
        await db.collection(LOCK_COLLECTION).deleteMany({});
    });

    const executeCleanup = () => (FileCleanupJob.default?.execute || FileCleanupJob.execute);

    describe("Multiple instances behavior", () => {
        test('should skip cleanup when another instance holds lock', async () => {
            await File.create(createTestFile({
                expirationDate: daysAgo(5),
                filename: 'locked-test.json'
            }));

            DistributedLock.setInstanceId('instance-A');
            await DistributedLock.acquireLock('cleanup');

            DistributedLock.setInstanceId('instance-B');
            const initialCount = await File.countDocuments({ filename: 'locked-test.json' });
            expect(initialCount).toBe(1);

            await executeCleanup()(false);

            const afterCount = await File.countDocuments({ filename: 'locked-test.json' });
            expect(afterCount).toBe(1);
        });

        test('should run cleanup when lock is available', async () => {
            await File.create(createTestFile({
                expirationDate: daysAgo(5),
                filename: 'unlocked-test.json'
            }));

            DistributedLock.setInstanceId('instance-C');

            const initialCount = await File.countDocuments({ filename: 'unlocked-test.json' });
            expect(initialCount).toBe(1);

            await executeCleanup()(false);

            const afterCount = await File.countDocuments({ filename: 'unlocked-test.json' });
            expect(afterCount).toBe(0);
        });

        test('should run cleanup when previous lock expired', async () => {
            const db = mongoose.connection.db;
            await db.collection(LOCK_COLLECTION).insertOne({
                _id: 'cleanup_lock',
                instanceId: 'old-instance',
                acquiredAt: Date.now() - (LOCK_TIMEOUT_MS + 1000)
            });

            await File.create(createTestFile({
                expirationDate: daysAgo(5),
                filename: 'expired-lock-test.json'
            }));

            DistributedLock.setInstanceId('new-instance');

            await executeCleanup()(false);

            const afterCount = await File.countDocuments({ filename: 'expired-lock-test.json' });
            expect(afterCount).toBe(0);
        });

        test('should release lock after successful cleanup', async () => {
            DistributedLock.setInstanceId('instance-release');

            await executeCleanup()(false);

            const holder = await DistributedLock.getLockHolder('cleanup');
            expect(holder).toBeNull();
        });

        test('should handle same instance calling execute multiple times', async () => {
            await File.create(createTestFile({
                expirationDate: daysAgo(5),
                filename: 'multi-exec.json'
            }));

            DistributedLock.setInstanceId('instance-multi');

            await executeCleanup()(false);
            await executeCleanup()(false);

            const afterCount = await File.countDocuments({ filename: 'multi-exec.json' });
            expect(afterCount).toBe(0);
        });
    });

    describe("Lock holder logging", () => {
        test('should log lock holder when skipping', async () => {
            await File.create(createTestFile({
                expirationDate: daysAgo(5),
                filename: 'log-holder-test.json'
            }));

            DistributedLock.setInstanceId('holder-instance');
            await DistributedLock.acquireLock('cleanup');

            DistributedLock.setInstanceId('requestor-instance');

            const holder = await DistributedLock.getLockHolder('cleanup');
            expect(holder).toBe('holder-instance');
        });
    });

    describe("Invalid inputs", () => {
        test('should handle null lock name gracefully', async () => {
            const result = await DistributedLock.acquireLock(null);
            expect(typeof result).toBe('boolean');
        });

        test('should handle empty string lock name gracefully', async () => {
            const result = await DistributedLock.acquireLock('');
            expect(typeof result).toBe('boolean');
        });

        test('should handle undefined lock name gracefully', async () => {
            const result = await DistributedLock.acquireLock(undefined);
            expect(typeof result).toBe('boolean');
        });
    });

    describe("Scheduler enabled/disabled", () => {
        test('should skip cleanup when scheduler is disabled via startFileCleanupJob', async () => {
            FileCleanupJob.stopFileCleanupJob();
            
            await File.create(createTestFile({
                expirationDate: daysAgo(5),
                filename: 'disabled-scheduler-test.json'
            }));

            FileCleanupJob.startFileCleanupJob({ enabled: false });

            const beforeCount = await File.countDocuments({ filename: 'disabled-scheduler-test.json' });
            expect(beforeCount).toBe(1);

            await executeCleanup()(false);

            const afterCount = await File.countDocuments({ filename: 'disabled-scheduler-test.json' });
            expect(afterCount).toBe(1);

            FileCleanupJob.stopFileCleanupJob();
            FileCleanupJob.startFileCleanupJob({ enabled: true });
        });
    });
});
