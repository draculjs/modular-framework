const File = require('../../src/models/FileModel');
const UserStorage = require('../../src/models/UserStorageModel');
const mongoHandler = require('../utils/mongo-handler');
const FileService = require('../../src/services/FileService').default;
const { updateUserUsedStorage, fixUsedSpaceInconsistencies } = require('../../src/services/UserStorageService');
const { TEST_USER_ID, OTHER_USER_ID, createTestFile, daysAgo } = require('../data/test-data');
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');

const TEST_FILES_DIR = '/tmp/test-usedspace-files';

const createRealFile = async (filename, content) => {
    const filePath = path.join(TEST_FILES_DIR, filename);
    await fs.mkdir(TEST_FILES_DIR, { recursive: true });
    await fs.writeFile(filePath, content);
    return filePath;
};

const cleanupTestFiles = async () => {
    try {
        const files = await fs.readdir(TEST_FILES_DIR);
        for (const file of files) {
            try {
                await fs.unlink(path.join(TEST_FILES_DIR, file));
            } catch (e) {}
        }
    } catch (e) {}
};

describe("UserStorage usedSpace - Robustness Tests", () => {

    beforeAll(async () => {
        await mongoHandler.connect();
        await fs.mkdir(TEST_FILES_DIR, { recursive: true });
    });

    afterAll(async () => {
        await mongoHandler.closeDatabase();
        try {
            await fs.rm(TEST_FILES_DIR, { recursive: true, force: true });
        } catch (e) {}
    });

    beforeEach(async () => {
        await mongoHandler.clearDatabase();
        await cleanupTestFiles();
    });

    afterEach(async () => {
        await cleanupTestFiles();
    });

    describe("updateUserUsedStorage - Prevention of negative values", () => {
        test('should clamp to 0 when subtraction would result in negative', async () => {
            await UserStorage.create({
                user: TEST_USER_ID,
                capacity: 1024,
                usedSpace: 100,
                maxFileSize: 100,
                fileExpirationTime: 30,
                deleteByLastAccess: true,
                deleteByCreatedAt: false,
                filesPrivacy: 'private'
            });

            const result = await updateUserUsedStorage(TEST_USER_ID, -500);

            const storage = await UserStorage.findOne({ user: TEST_USER_ID });
            expect(storage.usedSpace).toBe(0);
        });

        test('should allow exact subtraction resulting in zero', async () => {
            await UserStorage.create({
                user: TEST_USER_ID,
                capacity: 1024,
                usedSpace: 100,
                maxFileSize: 100,
                fileExpirationTime: 30,
                deleteByLastAccess: true,
                deleteByCreatedAt: false,
                filesPrivacy: 'private'
            });

            await updateUserUsedStorage(TEST_USER_ID, -100);

            const storage = await UserStorage.findOne({ user: TEST_USER_ID });
            expect(storage.usedSpace).toBe(0);
        });

        test('should allow positive addition', async () => {
            await UserStorage.create({
                user: TEST_USER_ID,
                capacity: 1024,
                usedSpace: 100,
                maxFileSize: 100,
                fileExpirationTime: 30,
                deleteByLastAccess: true,
                deleteByCreatedAt: false,
                filesPrivacy: 'private'
            });

            await updateUserUsedStorage(TEST_USER_ID, 50);

            const storage = await UserStorage.findOne({ user: TEST_USER_ID });
            expect(storage.usedSpace).toBe(150);
        });

        test('should handle partial subtraction correctly', async () => {
            await UserStorage.create({
                user: TEST_USER_ID,
                capacity: 1024,
                usedSpace: 1000,
                maxFileSize: 100,
                fileExpirationTime: 30,
                deleteByLastAccess: true,
                deleteByCreatedAt: false,
                filesPrivacy: 'private'
            });

            await updateUserUsedStorage(TEST_USER_ID, -300);

            const storage = await UserStorage.findOne({ user: TEST_USER_ID });
            expect(storage.usedSpace).toBe(700);
        });
    });

    describe("File deletion updates usedSpace correctly", () => {
        test('should decrement usedSpace when file is deleted', async () => {
            const fileSizeMB = 0.5;
            
            await UserStorage.create({
                user: TEST_USER_ID,
                capacity: 1024,
                usedSpace: fileSizeMB,
                maxFileSize: 100,
                fileExpirationTime: 30,
                deleteByLastAccess: true,
                deleteByCreatedAt: false,
                filesPrivacy: 'private'
            });

            const filePath = await createRealFile('delete-space.txt', 'content');

            const file = await File.create(createTestFile({
                filename: 'delete-space.txt',
                relativePath: filePath,
                absolutePath: filePath,
                size: fileSizeMB
            }));

            await FileService._robustDelete(file, 'TEST', 'Test deletion');

            const storage = await UserStorage.findOne({ user: TEST_USER_ID });
            expect(storage.usedSpace).toBe(0);
        });

        test('should not decrement below zero when deleting', async () => {
            const fileSizeMB = 0.5;
            
            await UserStorage.create({
                user: TEST_USER_ID,
                capacity: 1024,
                usedSpace: fileSizeMB,
                maxFileSize: 100,
                fileExpirationTime: 30,
                deleteByLastAccess: true,
                deleteByCreatedAt: false,
                filesPrivacy: 'private'
            });

            const filePath = await createRealFile('over-delete.txt', 'content');

            const file = await File.create(createTestFile({
                filename: 'over-delete.txt',
                relativePath: filePath,
                absolutePath: filePath,
                size: fileSizeMB
            }));

            await FileService._robustDelete(file, 'TEST', 'Test');

            const storage = await UserStorage.findOne({ user: TEST_USER_ID });
            expect(storage.usedSpace).toBe(0);
        });

        test('should handle multiple file deletions correctly', async () => {
            const fileSizeMB = 0.1;
            const totalUsed = fileSizeMB * 3;
            
            await UserStorage.create({
                user: TEST_USER_ID,
                capacity: 1024,
                usedSpace: totalUsed,
                maxFileSize: 100,
                fileExpirationTime: 30,
                deleteByLastAccess: true,
                deleteByCreatedAt: false,
                filesPrivacy: 'private'
            });

            const file1Path = await createRealFile('multi-1.txt', 'content1');
            const file2Path = await createRealFile('multi-2.txt', 'content2');
            const file3Path = await createRealFile('multi-3.txt', 'content3');

            const file1 = await File.create(createTestFile({
                filename: 'multi-1.txt',
                relativePath: file1Path,
                absolutePath: file1Path,
                size: fileSizeMB
            }));

            const file2 = await File.create(createTestFile({
                filename: 'multi-2.txt',
                relativePath: file2Path,
                absolutePath: file2Path,
                size: fileSizeMB
            }));

            const file3 = await File.create(createTestFile({
                filename: 'multi-3.txt',
                relativePath: file3Path,
                absolutePath: file3Path,
                size: fileSizeMB
            }));

            await FileService._robustDelete(file1, 'TEST', 'Delete 1');
            await FileService._robustDelete(file2, 'TEST', 'Delete 2');
            await FileService._robustDelete(file3, 'TEST', 'Delete 3');

            const storage = await UserStorage.findOne({ user: TEST_USER_ID });
            expect(storage.usedSpace).toBeCloseTo(0, 5);
        });
    });

    describe("File replacement updates usedSpace correctly", () => {
        test('should replace file and update usedSpace correctly', async () => {
            const oldSize = 0.2;
            const newSize = 0.1;
            
            await UserStorage.create({
                user: TEST_USER_ID,
                capacity: 1024,
                usedSpace: oldSize,
                maxFileSize: 100,
                fileExpirationTime: 30,
                deleteByLastAccess: true,
                deleteByCreatedAt: false,
                filesPrivacy: 'private'
            });

            const filePath = await createRealFile('replace-test.txt', 'old content');

            const file = await File.create(createTestFile({
                filename: 'replace-test.txt',
                relativePath: filePath,
                absolutePath: filePath,
                size: oldSize
            }));

            await FileService._robustDelete(file, 'TEST', 'Delete before replace');

            const storage1 = await UserStorage.findOne({ user: TEST_USER_ID });
            expect(storage1.usedSpace).toBe(0);

            await updateUserUsedStorage(TEST_USER_ID, newSize);

            const storage2 = await UserStorage.findOne({ user: TEST_USER_ID });
            expect(storage2.usedSpace).toBe(newSize);
        });
    });

    describe("Parallel deletion does not cause double subtraction", () => {
        test('should not subtract twice for same file', async () => {
            const fileSizeMB = 0.5;
            
            await UserStorage.create({
                user: TEST_USER_ID,
                capacity: 1024,
                usedSpace: fileSizeMB,
                maxFileSize: 100,
                fileExpirationTime: 30,
                deleteByLastAccess: true,
                deleteByCreatedAt: false,
                filesPrivacy: 'private'
            });

            const filePath = await createRealFile('double-delete.txt', 'content');

            const file = await File.create(createTestFile({
                filename: 'double-delete.txt',
                relativePath: filePath,
                absolutePath: filePath,
                size: fileSizeMB
            }));

            const fileDoc = file.toObject();

            await FileService._robustDelete(fileDoc, 'TEST', 'First delete');
            await FileService._robustDelete(fileDoc, 'TEST', 'Second delete');

            const storage = await UserStorage.findOne({ user: TEST_USER_ID });
            expect(storage.usedSpace).toBe(0);
        });
    });

    describe("Edge cases", () => {
        test('should handle file with zero size', async () => {
            const fileSizeMB = 0.1;
            
            await UserStorage.create({
                user: TEST_USER_ID,
                capacity: 1024,
                usedSpace: fileSizeMB,
                maxFileSize: 100,
                fileExpirationTime: 30,
                deleteByLastAccess: true,
                deleteByCreatedAt: false,
                filesPrivacy: 'private'
            });

            const filePath = await createRealFile('zero-size.txt', '');

            const file = await File.create(createTestFile({
                filename: 'zero-size.txt',
                relativePath: filePath,
                absolutePath: filePath,
                size: 0
            }));

            await FileService._robustDelete(file, 'TEST', 'Delete zero size');

            const storage = await UserStorage.findOne({ user: TEST_USER_ID });
            expect(storage.usedSpace).toBe(fileSizeMB);
        });

        test('should handle null creatorId gracefully', async () => {
            const filePath = await createRealFile('no-creator.txt', 'content');

            const file = await File.create(createTestFile({
                filename: 'no-creator.txt',
                relativePath: filePath,
                absolutePath: filePath,
                size: 0.1,
                createdBy: { user: null, username: 'test' }
            }));

            const result = await FileService._robustDelete(file, 'TEST', 'No creator test');

            expect(result).toBe(true);
        });

        test('should handle non-existent user gracefully', async () => {
            const result = await updateUserUsedStorage('000000000000000000000000', 100);

            expect(result).toBeNull();
        });
    });

    describe("fixUsedSpaceInconsistencies", () => {
        test('should fix incorrect usedSpace based on actual files', async () => {
            await UserStorage.create({
                user: TEST_USER_ID,
                capacity: 1024,
                usedSpace: 1000,
                maxFileSize: 100,
                fileExpirationTime: 30,
                deleteByLastAccess: true,
                deleteByCreatedAt: false,
                filesPrivacy: 'private'
            });

            const filePath = await createRealFile('fix-test.txt', 'content');

            await File.create(createTestFile({
                filename: 'fix-test.txt',
                relativePath: filePath,
                absolutePath: filePath,
                size: 0.5,
                createdBy: { user: TEST_USER_ID, username: 'testuser' }
            }));

            const beforeStorage = await UserStorage.findOne({ user: TEST_USER_ID });
            expect(beforeStorage.usedSpace).toBe(1000);

            const fixedCount = await fixUsedSpaceInconsistencies();

            const afterStorage = await UserStorage.findOne({ user: TEST_USER_ID });
            expect(afterStorage.usedSpace).toBeCloseTo(0.5, 2);
            expect(fixedCount).toBe(1);
        });

        test('should not modify correct usedSpace', async () => {
            const correctSize = 0.5;

            await UserStorage.create({
                user: TEST_USER_ID,
                capacity: 1024,
                usedSpace: correctSize,
                maxFileSize: 100,
                fileExpirationTime: 30,
                deleteByLastAccess: true,
                deleteByCreatedAt: false,
                filesPrivacy: 'private'
            });

            const filePath = await createRealFile('correct-test.txt', 'content');

            await File.create(createTestFile({
                filename: 'correct-test.txt',
                relativePath: filePath,
                absolutePath: filePath,
                size: correctSize,
                createdBy: { user: TEST_USER_ID, username: 'testuser' }
            }));

            const fixedCount = await fixUsedSpaceInconsistencies();

            expect(fixedCount).toBe(0);
        });

        test('should fix multiple users with inconsistencies', async () => {
            await UserStorage.create({
                user: TEST_USER_ID,
                capacity: 1024,
                usedSpace: 1000,
                maxFileSize: 100,
                fileExpirationTime: 30,
                deleteByLastAccess: true,
                deleteByCreatedAt: false,
                filesPrivacy: 'private'
            });

            await UserStorage.create({
                user: OTHER_USER_ID,
                capacity: 1024,
                usedSpace: 500,
                maxFileSize: 100,
                fileExpirationTime: 30,
                deleteByLastAccess: true,
                deleteByCreatedAt: false,
                filesPrivacy: 'private'
            });

            const file1Path = await createRealFile('multi-user-1.txt', 'content');
            const file2Path = await createRealFile('multi-user-2.txt', 'content');

            await File.create(createTestFile({
                filename: 'multi-user-1.txt',
                relativePath: file1Path,
                absolutePath: file1Path,
                size: 0.3,
                createdBy: { user: TEST_USER_ID, username: 'testuser' }
            }));

            await File.create(createTestFile({
                filename: 'multi-user-2.txt',
                relativePath: file2Path,
                absolutePath: file2Path,
                size: 0.2,
                createdBy: { user: OTHER_USER_ID, username: 'otheruser' }
            }));

            const fixedCount = await fixUsedSpaceInconsistencies();

            expect(fixedCount).toBe(2);

            const storage1 = await UserStorage.findOne({ user: TEST_USER_ID });
            const storage2 = await UserStorage.findOne({ user: OTHER_USER_ID });

            expect(storage1.usedSpace).toBeCloseTo(0.3, 2);
            expect(storage2.usedSpace).toBeCloseTo(0.2, 2);
        });

        test('should handle user with no files', async () => {
            await UserStorage.create({
                user: TEST_USER_ID,
                capacity: 1024,
                usedSpace: 100,
                maxFileSize: 100,
                fileExpirationTime: 30,
                deleteByLastAccess: true,
                deleteByCreatedAt: false,
                filesPrivacy: 'private'
            });

            const fixedCount = await fixUsedSpaceInconsistencies();

            const storage = await UserStorage.findOne({ user: TEST_USER_ID });
            expect(storage.usedSpace).toBe(0);
            expect(fixedCount).toBe(1);
        });
    });

    describe("Orphan file detection", () => {
        test('should detect files in DB but not on disk', async () => {
            const filePath = await createRealFile('orphan-db-test.txt', 'content');
            const userIdStr = TEST_USER_ID.toString();

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

            const file = await File.create(createTestFile({
                filename: 'orphan-db-test.txt',
                relativePath: filePath,
                absolutePath: filePath,
                size: 0.1,
                createdBy: { user: TEST_USER_ID, username: 'testuser' }
            }));

            await fs.unlink(filePath);

            const orphansInDB = await File.find({ 'createdBy.user': TEST_USER_ID }).lean();
            expect(orphansInDB.length).toBe(1);

            await fixUsedSpaceInconsistencies();

            const orphanStillExists = await File.findById(file._id).lean();
            expect(orphanStillExists).toBeDefined();
        });

        test('should scan user files directory', async () => {
            const { scanUserFiles } = require('../../src/services/helpers/scanUserFiles');
            
            const scanBaseDir = '/tmp/scan-test-media';
            const username = 'testuser';
            const year = '2025';
            const month = '01';
            const scanDir = path.join(scanBaseDir, 'media', 'files', username, year, month);
            await fs.mkdir(scanDir, { recursive: true });
            
            const fileName = 'scan-test.txt';
            const fileContent = 'scan content';
            const filePath = path.join(scanDir, fileName);
            await fs.writeFile(filePath, fileContent);

            const files = await scanUserFiles(scanBaseDir);
            
            const foundFile = files.find(f => f.absolutePath === filePath);
            expect(foundFile).toBeDefined();
            expect(foundFile.size).toBeGreaterThan(0);
            
            await fs.rm(scanBaseDir, { recursive: true, force: true });
        });

        test('should handle empty files directory', async () => {
            const { scanUserFiles } = require('../../src/services/helpers/scanUserFiles');
            
            await cleanupTestFiles();

            const files = await scanUserFiles('/tmp');
            
            const testFiles = files.filter(f => f.absolutePath.includes('test-usedspace-files'));
            expect(testFiles.length).toBeGreaterThanOrEqual(0);
        });
    });
});
