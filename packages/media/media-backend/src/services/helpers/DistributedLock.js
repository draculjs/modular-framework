import mongoose from 'mongoose';

const LOCK_COLLECTION = 'cleanup_locks';
const LOCK_TIMEOUT_MS = 5 * 60 * 1000;

const DistributedLock = {
    instanceId: null,
    
    setInstanceId(id) {
        this.instanceId = id;
    },
    
    getInstanceId() {
        if (this.instanceId) return this.instanceId;
        return `instance-${process.pid}-${Date.now()}`;
    },
    
    async acquireLock(lockName = 'cleanup') {
        const db = mongoose.connection.db;
        if (!db) return false;
        
        const collection = db.collection(LOCK_COLLECTION);
        const now = Date.now();
        const lockId = `${lockName}_lock`;
        const myInstanceId = this.getInstanceId();
        
        try {
            await collection.updateOne(
                {
                    _id: lockId,
                    $or: [
                        { instanceId: myInstanceId },
                        { acquiredAt: { $lt: now - LOCK_TIMEOUT_MS } }
                    ]
                },
                {
                    $set: {
                        instanceId: myInstanceId,
                        acquiredAt: now
                    }
                },
                { upsert: true }
            );
            
            const lock = await collection.findOne({ _id: lockId });
            return lock && lock.instanceId === myInstanceId;
        } catch (error) {
            return false;
        }
    },
    
    async releaseLock(lockName = 'cleanup') {
        const db = mongoose.connection.db;
        if (!db) return false;
        
        const collection = db.collection(LOCK_COLLECTION);
        const lockId = `${lockName}_lock`;
        
        try {
            await collection.deleteOne({
                _id: lockId,
                instanceId: this.getInstanceId()
            });
            return true;
        } catch (error) {
            return false;
        }
    },
    
    async isLocked(lockName = 'cleanup') {
        const db = mongoose.connection.db;
        if (!db) return false;
        
        const collection = db.collection(LOCK_COLLECTION);
        const lockId = `${lockName}_lock`;
        const now = Date.now();
        
        try {
            const lock = await collection.findOne({ _id: lockId });
            if (!lock) return false;
            if (lock.instanceId === this.getInstanceId()) return false;
            if (lock.acquiredAt < now - LOCK_TIMEOUT_MS) return false;
            return true;
        } catch (error) {
            return false;
        }
    },
    
    async getLockHolder(lockName = 'cleanup') {
        const db = mongoose.connection.db;
        if (!db) return null;
        
        const collection = db.collection(LOCK_COLLECTION);
        const lockId = `${lockName}_lock`;
        
        try {
            const lock = await collection.findOne({ _id: lockId });
            if (!lock) return null;
            if (lock.acquiredAt < Date.now() - LOCK_TIMEOUT_MS) return null;
            return lock.instanceId;
        } catch (error) {
            return null;
        }
    },
    
    async cleanup() {
        const db = mongoose.connection.db;
        if (!db) return 0;
        
        const collection = db.collection(LOCK_COLLECTION);
        const now = Date.now();
        
        try {
            const result = await collection.deleteMany({
                acquiredAt: { $lt: now - LOCK_TIMEOUT_MS }
            });
            return result.deletedCount;
        } catch (error) {
            return 0;
        }
    }
};

export { DistributedLock, LOCK_COLLECTION, LOCK_TIMEOUT_MS };
export default DistributedLock;
