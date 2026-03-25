
const mongoose = require('mongoose');
const { updateUserUsedStorage } = require('../../src/services/UserStorageService');
const UserStorage = require('../../src/models/UserStorageModel');
const mongoHandler = require('../utils/mongo-handler');

describe("UserStorageService.updateUserUsedStorage - Clamping Tests", () => {
    
    beforeAll(async () => {
        await mongoHandler.connect();
    });

    afterAll(async () => {
        await mongoHandler.closeDatabase();
    });

    beforeEach(async () => {
        await mongoHandler.clearDatabase();
    });

    test('should clamp usedSpace to 0 when decrementing more than current value', async () => {
        const userId = new mongoose.Types.ObjectId();
        
        // Initial state: 10MB
        await UserStorage.create({
            user: userId,
            capacity: 100,
            usedSpace: 10,
            maxFileSize: 100,
            fileExpirationTime: 365
        });

        // Decrement 15MB -> Result should be 0, not -5
        await updateUserUsedStorage(userId, -15);

        const storage = await UserStorage.findOne({ user: userId });
        expect(storage.usedSpace).toBe(0);
    });

    test('should handle multiple simultaneous decrements and keep usedSpace >= 0', async () => {
        const userId = new mongoose.Types.ObjectId();
        
        // Initial state: 10MB
        await UserStorage.create({
            user: userId,
            capacity: 100,
            usedSpace: 10,
            maxFileSize: 100,
            fileExpirationTime: 365
        });

        // Simulate 5 simultaneous decrements of 3MB each (Total 15MB)
        const updates = [
            updateUserUsedStorage(userId, -3),
            updateUserUsedStorage(userId, -3),
            updateUserUsedStorage(userId, -3),
            updateUserUsedStorage(userId, -3),
            updateUserUsedStorage(userId, -3)
        ];

        await Promise.all(updates);

        const storage = await UserStorage.findOne({ user: userId });
        
        // Current implementation is NOT atomic (findOne + findOneAndUpdate)
        // This test might pass by CHANCE or fail if race condition occurs.
        // We want to ENSURE it never goes below 0.
        expect(storage.usedSpace).toBeGreaterThanOrEqual(0);
        expect(storage.usedSpace).toBe(0);
    });

    test('should not change value when decrementing from 0', async () => {
        const userId = new mongoose.Types.ObjectId();
        
        // Initial state: 0MB
        await UserStorage.create({
            user: userId,
            capacity: 100,
            usedSpace: 0,
            maxFileSize: 100,
            fileExpirationTime: 365
        });

        await updateUserUsedStorage(userId, -10);

        const storage = await UserStorage.findOne({ user: userId });
        expect(storage.usedSpace).toBe(0);
    });
});
