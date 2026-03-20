import mongoose from 'mongoose';
import { DefaultLogger as winston } from '@dracul/logger-backend';

const LOCK_COLLECTION = 'cleanup_locks';
const LOCK_TIMEOUT_MS = 5 * 60 * 1000;

const DistributedLock = {
    instanceId: null,
    
    setInstanceId(id) {
        winston.debug(`DistributedLock.setInstanceId: setting instanceId to '${id}'`);
        this.instanceId = id;
    },
    
    getInstanceId() {
        if (this.instanceId) {
            winston.debug(`DistributedLock.getInstanceId: returning cached instanceId '${this.instanceId}'`);
            return this.instanceId;
        }
        const generatedId = `instance-${process.pid}-${Date.now()}`;
        winston.debug(`DistributedLock.getInstanceId: generated new instanceId '${generatedId}'`);
        return generatedId;
    },
    
    async acquireLock(lockName = 'cleanup') {
        const db = mongoose.connection.db;
        if (!db) {
            winston.warn(`DistributedLock.acquireLock: database not connected, cannot acquire lock '${lockName}'`);
            return false;
        }
        
        const collection = db.collection(LOCK_COLLECTION);
        const now = Date.now();
        const lockId = `${lockName}_lock`;
        const myInstanceId = this.getInstanceId();
        
        try {
            const expiredBefore = await collection.countDocuments({
                acquiredAt: { $lt: now - LOCK_TIMEOUT_MS }
            });
            
            if (expiredBefore > 0) {
                winston.info(`DistributedLock.acquireLock: cleaning ${expiredBefore} expired lock(s) before acquiring '${lockName}'`);
            }
            
            await collection.deleteMany({
                acquiredAt: { $lt: now - LOCK_TIMEOUT_MS }
            });
            
            winston.debug(`DistributedLock.acquireLock: attempting to acquire lock '${lockName}' with instanceId '${myInstanceId}'`);
            
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
            const acquired = lock && lock.instanceId === myInstanceId;
            
            if (acquired) {
                winston.info(`DistributedLock.acquireLock: successfully acquired lock '${lockName}' for instance '${myInstanceId}'`);
            } else {
                const currentHolder = lock ? lock.instanceId : 'unknown';
                const acquiredAt = lock ? new Date(lock.acquiredAt).toISOString() : 'unknown';
                winston.info(`DistributedLock.acquireLock: failed to acquire lock '${lockName}' - held by '${currentHolder}' since ${acquiredAt}`);
            }
            
            return acquired;
        } catch (error) {
            winston.error(`DistributedLock.acquireLock: error acquiring lock '${lockName}' - ${error.message}`, { error: error.stack });
            return false;
        }
    },
    
    async releaseLock(lockName = 'cleanup') {
        const db = mongoose.connection.db;
        if (!db) {
            winston.warn(`DistributedLock.releaseLock: database not connected, cannot release lock '${lockName}'`);
            return false;
        }
        
        const collection = db.collection(LOCK_COLLECTION);
        const lockId = `${lockName}_lock`;
        const myInstanceId = this.getInstanceId();
        
        try {
            const lockBefore = await collection.findOne({ _id: lockId });
            const wasHeldBy = lockBefore ? lockBefore.instanceId : null;
            
            const result = await collection.deleteOne({
                _id: lockId,
                instanceId: myInstanceId
            });
            
            if (result.deletedCount > 0) {
                winston.info(`DistributedLock.releaseLock: released lock '${lockName}' (was held by '${wasHeldBy || myInstanceId}')`);
                return true;
            } else {
                winston.warn(`DistributedLock.releaseLock: no lock to release for '${lockName}' (instanceId '${myInstanceId}')`);
                return true;
            }
        } catch (error) {
            winston.error(`DistributedLock.releaseLock: error releasing lock '${lockName}' - ${error.message}`, { error: error.stack });
            return false;
        }
    },
    
    async isLocked(lockName = 'cleanup') {
        const db = mongoose.connection.db;
        if (!db) {
            winston.debug(`DistributedLock.isLocked: database not connected, returning false for '${lockName}'`);
            return false;
        }
        
        const collection = db.collection(LOCK_COLLECTION);
        const lockId = `${lockName}_lock`;
        const now = Date.now();
        
        try {
            const lock = await collection.findOne({ _id: lockId });
            
            if (!lock) {
                winston.debug(`DistributedLock.isLocked: no lock exists for '${lockName}'`);
                return false;
            }
            
            if (lock.instanceId === this.getInstanceId()) {
                winston.debug(`DistributedLock.isLocked: lock '${lockName}' held by current instance`);
                return false;
            }
            
            if (lock.acquiredAt < now - LOCK_TIMEOUT_MS) {
                winston.debug(`DistributedLock.isLocked: lock '${lockName}' expired (acquiredAt: ${new Date(lock.acquiredAt).toISOString()})`);
                return false;
            }
            
            const remainingMs = LOCK_TIMEOUT_MS - (now - lock.acquiredAt);
            winston.debug(`DistributedLock.isLocked: lock '${lockName}' held by '${lock.instanceId}' (expires in ${Math.round(remainingMs / 1000)}s)`);
            return true;
        } catch (error) {
            winston.error(`DistributedLock.isLocked: error checking lock '${lockName}' - ${error.message}`, { error: error.stack });
            return false;
        }
    },
    
    async getLockHolder(lockName = 'cleanup') {
        const db = mongoose.connection.db;
        if (!db) {
            winston.debug(`DistributedLock.getLockHolder: database not connected, returning null for '${lockName}'`);
            return null;
        }
        
        const collection = db.collection(LOCK_COLLECTION);
        const lockId = `${lockName}_lock`;
        const now = Date.now();
        
        try {
            const lock = await collection.findOne({ _id: lockId });
            
            if (!lock) {
                winston.debug(`DistributedLock.getLockHolder: no lock found for '${lockName}'`);
                return null;
            }
            
            if (lock.acquiredAt < now - LOCK_TIMEOUT_MS) {
                winston.debug(`DistributedLock.getLockHolder: lock '${lockName}' expired (acquiredAt: ${new Date(lock.acquiredAt).toISOString()})`);
                return null;
            }
            
            const remainingMs = LOCK_TIMEOUT_MS - (now - lock.acquiredAt);
            winston.debug(`DistributedLock.getLockHolder: lock '${lockName}' held by '${lock.instanceId}' (expires in ${Math.round(remainingMs / 1000)}s)`);
            return lock.instanceId;
        } catch (error) {
            winston.error(`DistributedLock.getLockHolder: error getting holder for '${lockName}' - ${error.message}`, { error: error.stack });
            return null;
        }
    },
    
    async cleanup() {
        const db = mongoose.connection.db;
        if (!db) {
            winston.warn(`DistributedLock.cleanup: database not connected, cannot cleanup`);
            return 0;
        }
        
        const collection = db.collection(LOCK_COLLECTION);
        const now = Date.now();
        const expirationThreshold = now - LOCK_TIMEOUT_MS;
        
        try {
            const expiredCount = await collection.countDocuments({
                acquiredAt: { $lt: expirationThreshold }
            });
            
            if (expiredCount === 0) {
                winston.debug(`DistributedLock.cleanup: no expired locks found`);
                return 0;
            }
            
            winston.info(`DistributedLock.cleanup: removing ${expiredCount} expired lock(s)`);
            
            const result = await collection.deleteMany({
                acquiredAt: { $lt: expirationThreshold }
            });
            
            winston.info(`DistributedLock.cleanup: removed ${result.deletedCount} expired lock(s)`);
            return result.deletedCount;
        } catch (error) {
            winston.error(`DistributedLock.cleanup: error during cleanup - ${error.message}`, { error: error.stack });
            return 0;
        }
    }
};

export { DistributedLock, LOCK_COLLECTION, LOCK_TIMEOUT_MS };
export default DistributedLock;
