const mongoose = require('mongoose');
const FileService = require('../../src/services/FileService').default;
const File = require('../../src/models/FileModel');
const UserStorage = require('../../src/models/UserStorageModel');
const mongoHandler = require('../utils/mongo-handler');
const {
    TEST_USER_ID,
    USER_STORAGE_BY_LAST_ACCESS,
    createTestFile,
    daysAgo,
    daysFromNow
} = require('../data/test-data');
const { FILE_SHOW_ALL } = require('../../src/permissions/File');

jest.mock('@dracul/user-backend', () => ({
    GroupService: {
        fetchMyGroups: jest.fn().mockResolvedValue([])
    },
    UserService: {
        findUser: jest.fn(),
        findUserByUsername: jest.fn()
    }
}));

const { GroupService } = require('@dracul/user-backend');

jest.setTimeout(30000);

if (!mongoose.models.User) {
    mongoose.model('User', new mongoose.Schema({
        username: String
    }));
}

const authUser = {
    id: TEST_USER_ID.toString(),
    username: 'testuser'
};

const createStorage = (overrides = {}) => {
    return UserStorage.create({
        ...USER_STORAGE_BY_LAST_ACCESS,
        user: TEST_USER_ID,
        fileExpirationTime: 5,
        ...overrides
    });
};

const updateInput = (file, overrides = {}) => ({
    id: file.id,
    description: file.description,
    tags: file.tags || [],
    expirationDate: file.expirationDate,
    isPublic: file.isPublic || false,
    groups: file.groups || [],
    users: file.users || [],
    ...overrides
});

describe('FileService update expiration safety (#167382 Case 1)', () => {
    const originalMediaTimezone = process.env.MEDIA_TIMEZONE;

    beforeAll(async () => {
        await mongoHandler.connect();
    });

    afterAll(async () => {
        await mongoHandler.closeDatabase();
    });

    beforeEach(async () => {
        await mongoHandler.clearDatabase();
        jest.clearAllMocks();
        jest.useRealTimers();
        delete process.env.MEDIA_TIMEZONE;
        GroupService.fetchMyGroups.mockResolvedValue([]);
    });

    afterEach(() => {
        jest.useRealTimers();
        if (originalMediaTimezone === undefined) {
            delete process.env.MEDIA_TIMEZONE;
        } else {
            process.env.MEDIA_TIMEZONE = originalMediaTimezone;
        }
    });

    test('updateFile rejects a past expirationDate and cleanup does not delete the file', async () => {
        await createStorage();
        const originalExpiration = daysFromNow(3);
        const file = await File.create(createTestFile({
            filename: 'update-past-expiration.json',
            description: 'original description',
            expirationDate: originalExpiration,
            createdBy: { user: TEST_USER_ID, username: authUser.username }
        }));

        await expect(FileService.updateFile(
            authUser,
            null,
            updateInput(file, {
                description: 'should not be persisted',
                expirationDate: daysAgo(1).toISOString()
            }),
            authUser.id,
            true,
            false,
            false
        )).rejects.toThrow('Expiration date must be older than current date');

        const afterFailedUpdate = await File.findById(file._id);
        expect(afterFailedUpdate).not.toBeNull();
        expect(afterFailedUpdate.description).toBe('original description');
        expect(afterFailedUpdate.expirationDate.getTime()).toBe(originalExpiration.getTime());

        const cleanupResult = await FileService.executeCleanup();
        expect(cleanupResult.deletedCount).toBe(0);
        expect(await File.countDocuments({ _id: file._id })).toBe(1);
    });

    test('updateFileMetadata rejects a past expirationDate and preserves existing metadata', async () => {
        await createStorage();
        const originalExpiration = daysFromNow(4);
        const file = await File.create(createTestFile({
            filename: 'metadata-past-expiration.json',
            description: 'original metadata',
            expirationDate: originalExpiration,
            createdBy: { user: TEST_USER_ID, username: authUser.username }
        }));

        await expect(FileService.updateFileMetadata(
            file.id,
            authUser,
            FILE_SHOW_ALL,
            {
                description: 'metadata should not change',
                expirationDate: daysAgo(2).toISOString()
            }
        )).rejects.toThrow('Expiration date must be older than current date');

        const afterFailedUpdate = await File.findById(file._id);
        expect(afterFailedUpdate.description).toBe('original metadata');
        expect(afterFailedUpdate.expirationDate.getTime()).toBe(originalExpiration.getTime());

        const cleanupResult = await FileService.executeCleanup();
        expect(cleanupResult.deletedCount).toBe(0);
        expect(await File.countDocuments({ _id: file._id })).toBe(1);
    });

    test('updateFile rejects an invalid expirationDate and preserves the previous expiration', async () => {
        await createStorage();
        const originalExpiration = daysFromNow(2);
        const file = await File.create(createTestFile({
            filename: 'invalid-expiration.json',
            expirationDate: originalExpiration,
            createdBy: { user: TEST_USER_ID, username: authUser.username }
        }));

        await expect(FileService.updateFile(
            authUser,
            null,
            updateInput(file, {
                expirationDate: 'not-a-date'
            }),
            authUser.id,
            true,
            false,
            false
        )).rejects.toThrow('Invalid date format');

        const afterFailedUpdate = await File.findById(file._id);
        expect(afterFailedUpdate.expirationDate.getTime()).toBe(originalExpiration.getTime());
    });

    test('updateFile accepts a future expirationDate within the user storage limit', async () => {
        await createStorage({ fileExpirationTime: 10 });
        const file = await File.create(createTestFile({
            filename: 'future-expiration.json',
            expirationDate: null,
            createdBy: { user: TEST_USER_ID, username: authUser.username }
        }));
        const futureExpiration = daysFromNow(3);

        const updated = await FileService.updateFile(
            authUser,
            null,
            updateInput(file, {
                description: 'future persisted',
                expirationDate: futureExpiration.toISOString()
            }),
            authUser.id,
            true,
            false,
            false
        );

        expect(updated.description).toBe('future persisted');
        expect(new Date(updated.expirationDate).getTime()).toBe(futureExpiration.getTime());

        const cleanupResult = await FileService.executeCleanup();
        expect(cleanupResult.deletedCount).toBe(0);
        expect(await File.countDocuments({ _id: file._id })).toBe(1);
    });

    test('updateFile accepts a future expirationDate serialized as a GraphQL timestamp string', async () => {
        await createStorage({ fileExpirationTime: 10 });
        const file = await File.create(createTestFile({
            filename: 'timestamp-string-expiration.json',
            expirationDate: null,
            createdBy: { user: TEST_USER_ID, username: authUser.username }
        }));
        const futureExpiration = daysFromNow(1);

        const updated = await FileService.updateFile(
            authUser,
            null,
            updateInput(file, {
                description: 'timestamp string persisted',
                expirationDate: futureExpiration.getTime().toString()
            }),
            authUser.id,
            true,
            false,
            false
        );

        expect(updated.description).toBe('timestamp string persisted');
        expect(new Date(updated.expirationDate).getTime()).toBe(futureExpiration.getTime());
    });

    test('normalizes a next-day UTC-midnight input using Argentina deployment timezone', () => {
        process.env.MEDIA_TIMEZONE = 'America/Argentina/Buenos_Aires';
        jest.useFakeTimers().setSystemTime(new Date('2026-05-08T01:00:00.000Z')); // 2026-05-07 22:00 ART

        const normalized = FileService._normalizeUpdateExpirationDate('2026-05-08T00:00:00.000Z');

        expect(normalized).toEqual({
            hasValue: true,
            value: new Date('2026-05-08T03:00:00.000Z')
        });
    });

    test('normalizes a next-day UTC-midnight input using Colombia deployment timezone', () => {
        process.env.MEDIA_TIMEZONE = 'America/Bogota';
        jest.useFakeTimers().setSystemTime(new Date('2026-05-08T03:00:00.000Z')); // 2026-05-07 22:00 COT

        const normalized = FileService._normalizeUpdateExpirationDate('2026-05-08T00:00:00.000Z');

        expect(normalized).toEqual({
            hasValue: true,
            value: new Date('2026-05-08T05:00:00.000Z')
        });
    });

    test('normalizes a date-only input using Madrid deployment timezone with DST', () => {
        process.env.MEDIA_TIMEZONE = 'Europe/Madrid';
        jest.useFakeTimers().setSystemTime(new Date('2026-05-07T20:00:00.000Z')); // 2026-05-07 22:00 CEST

        const normalized = FileService._normalizeUpdateExpirationDate('2026-05-08');

        expect(normalized).toEqual({
            hasValue: true,
            value: new Date('2026-05-07T22:00:00.000Z')
        });
    });

    test('rejects date-only expiration when MEDIA_TIMEZONE is invalid', () => {
        process.env.MEDIA_TIMEZONE = 'Invalid/Zone';
        jest.useFakeTimers().setSystemTime(new Date('2026-05-07T20:00:00.000Z'));

        expect(() => FileService._normalizeUpdateExpirationDate('2026-05-08'))
            .toThrow('Invalid media expiration timezone');
    });

    test('updateFileMetadata allows clearing explicit expirationDate with null', async () => {
        await createStorage();
        const file = await File.create(createTestFile({
            filename: 'clear-expiration.json',
            expirationDate: daysFromNow(2),
            createdBy: { user: TEST_USER_ID, username: authUser.username }
        }));

        const updated = await FileService.updateFileMetadata(
            file.id,
            authUser,
            FILE_SHOW_ALL,
            { expirationDate: null }
        );

        expect(updated.expirationDate).toBeNull();

        const cleanupResult = await FileService.executeCleanup();
        expect(cleanupResult.deletedCount).toBe(0);
        expect(await File.countDocuments({ _id: file._id })).toBe(1);
    });
});
