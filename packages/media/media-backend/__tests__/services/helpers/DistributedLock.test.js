const mongoose = require('mongoose');
const { DistributedLock, LOCK_COLLECTION, LOCK_TIMEOUT_MS } = require('../../../src/services/helpers/DistributedLock');
const mongoHandler = require('../../utils/mongo-handler');

describe("DistributedLock - TDD Tests", () => {

    beforeAll(async () => {
        await mongoHandler.connect();
        DistributedLock.setInstanceId('test-instance-1');
    });

    afterAll(async () => {
        const db = mongoose.connection.db;
        await db.collection(LOCK_COLLECTION).deleteMany({});
        await mongoHandler.closeDatabase();
    });

    beforeEach(async () => {
        const db = mongoose.connection.db;
        await db.collection(LOCK_COLLECTION).deleteMany({});
    });

    describe("acquireLock", () => {
        test('should acquire lock when no lock exists', async () => {
            const acquired = await DistributedLock.acquireLock('test');
            expect(acquired).toBe(true);
        });

        test('should not acquire lock when another instance holds it', async () => {
            DistributedLock.setInstanceId('instance-A');
            await DistributedLock.acquireLock('test');
            
            DistributedLock.setInstanceId('instance-B');
            const acquired = await DistributedLock.acquireLock('test');
            
            expect(acquired).toBe(false);
        });

        test('should acquire lock when same instance holds it', async () => {
            await DistributedLock.acquireLock('test');
            const acquired = await DistributedLock.acquireLock('test');
            expect(acquired).toBe(true);
        });

        test('should acquire lock when previous lock expired', async () => {
            const db = mongoose.connection.db;
            await db.collection(LOCK_COLLECTION).insertOne({
                _id: 'test_lock',
                instanceId: 'old-instance',
                acquiredAt: Date.now() - (LOCK_TIMEOUT_MS + 1000)
            });
            
            const acquired = await DistributedLock.acquireLock('test');
            expect(acquired).toBe(true);
        });

        test('should handle different lock names independently', async () => {
            await DistributedLock.acquireLock('lock-a');
            
            const acquiredA = await DistributedLock.acquireLock('lock-a');
            const acquiredB = await DistributedLock.acquireLock('lock-b');
            
            expect(acquiredA).toBe(true);
            expect(acquiredB).toBe(true);
        });
    });

    describe("releaseLock", () => {
        test('should release lock when holding it', async () => {
            await DistributedLock.acquireLock('test');
            const released = await DistributedLock.releaseLock('test');
            expect(released).toBe(true);
            
            const isLocked = await DistributedLock.isLocked('test');
            expect(isLocked).toBe(false);
        });

        test('should not release lock when another instance holds it', async () => {
            DistributedLock.setInstanceId('instance-A');
            await DistributedLock.acquireLock('test');
            
            DistributedLock.setInstanceId('instance-B');
            const released = await DistributedLock.releaseLock('test');
            expect(released).toBe(true);
            
            const holder = await DistributedLock.getLockHolder('test');
            expect(holder).toBe('instance-A');
        });
    });

    describe("isLocked", () => {
        test('should return false when no lock exists', async () => {
            const locked = await DistributedLock.isLocked('test');
            expect(locked).toBe(false);
        });

        test('should return true when another instance holds lock', async () => {
            DistributedLock.setInstanceId('instance-A');
            await DistributedLock.acquireLock('test');
            
            DistributedLock.setInstanceId('instance-B');
            const locked = await DistributedLock.isLocked('test');
            expect(locked).toBe(true);
        });

        test('should return false when current instance holds lock', async () => {
            await DistributedLock.acquireLock('test');
            const locked = await DistributedLock.isLocked('test');
            expect(locked).toBe(false);
        });

        test('should return false when lock expired', async () => {
            const db = mongoose.connection.db;
            await db.collection(LOCK_COLLECTION).insertOne({
                _id: 'test_lock',
                instanceId: 'old-instance',
                acquiredAt: Date.now() - (LOCK_TIMEOUT_MS + 1000)
            });
            
            const locked = await DistributedLock.isLocked('test');
            expect(locked).toBe(false);
        });
    });

    describe("getLockHolder", () => {
        test('should return null when no lock exists', async () => {
            const holder = await DistributedLock.getLockHolder('test');
            expect(holder).toBeNull();
        });

        test('should return instanceId when lock exists', async () => {
            DistributedLock.setInstanceId('holder-instance');
            await DistributedLock.acquireLock('test');
            
            const holder = await DistributedLock.getLockHolder('test');
            expect(holder).toBe('holder-instance');
        });

        test('should return null when lock expired', async () => {
            const db = mongoose.connection.db;
            await db.collection(LOCK_COLLECTION).insertOne({
                _id: 'test_lock',
                instanceId: 'old-instance',
                acquiredAt: Date.now() - (LOCK_TIMEOUT_MS + 1000)
            });
            
            const holder = await DistributedLock.getLockHolder('test');
            expect(holder).toBeNull();
        });
    });

    describe("cleanup", () => {
        test('should delete expired locks', async () => {
            const db = mongoose.connection.db;
            await db.collection(LOCK_COLLECTION).insertMany([
                { _id: 'expired_lock_1', instanceId: 'inst1', acquiredAt: Date.now() - (LOCK_TIMEOUT_MS + 1000) },
                { _id: 'expired_lock_2', instanceId: 'inst2', acquiredAt: Date.now() - (LOCK_TIMEOUT_MS + 1000) },
                { _id: 'valid_lock', instanceId: 'inst3', acquiredAt: Date.now() }
            ]);
            
            const deletedCount = await DistributedLock.cleanup();
            expect(deletedCount).toBe(2);
            
            const remaining = await db.collection(LOCK_COLLECTION).find({}).toArray();
            expect(remaining.length).toBe(1);
            expect(remaining[0]._id).toBe('valid_lock');
        });
    });

    describe("instanceId", () => {
        test('should return same instanceId for same identifier', async () => {
            DistributedLock.setInstanceId('my-instance');
            const id1 = DistributedLock.getInstanceId();
            const id2 = DistributedLock.getInstanceId();
            expect(id1).toBe(id2);
        });

        test('should return different instanceId for different identifiers', async () => {
            DistributedLock.setInstanceId('instance-1');
            const id1 = DistributedLock.getInstanceId();
            
            DistributedLock.setInstanceId('instance-2');
            const id2 = DistributedLock.getInstanceId();
            
            expect(id1).not.toBe(id2);
        });

        test('should generate default instanceId if not set', () => {
            DistributedLock.instanceId = null;
            const id = DistributedLock.getInstanceId();
            expect(id).toBeDefined();
            expect(id).toContain('instance-');
        });
    });
});
