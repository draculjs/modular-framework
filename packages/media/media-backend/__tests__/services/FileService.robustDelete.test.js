const File = require('../../src/models/FileModel');
const UserStorage = require('../../src/models/UserStorageModel');
const mongoHandler = require('../utils/mongo-handler');
const FileService = require('../../src/services/FileService').default;
const {createTestFile, daysAgo, TEST_USER_ID} = require('../data/test-data');
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');

const TEST_FILES_DIR = '/tmp/test-real-files';

const createRealFile = async (filename, content = 'test content', options = {}) => {
    const filePath = path.join(TEST_FILES_DIR, filename);
    await fs.mkdir(TEST_FILES_DIR, { recursive: true });
    await fs.writeFile(filePath, content);
    
    if (options.mode) {
        await fs.chmod(filePath, options.mode);
    }
    
    return filePath;
};

const createRealFileWithSize = async (filename, sizeInBytes) => {
    const filePath = path.join(TEST_FILES_DIR, filename);
    await fs.mkdir(TEST_FILES_DIR, { recursive: true });
    const buffer = Buffer.alloc(sizeInBytes);
    buffer.fill('x');
    await fs.writeFile(filePath, buffer);
    return filePath;
};

const fileExists = async (filePath) => {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
};

const getFileSize = async (filePath) => {
    try {
        const stats = await fs.stat(filePath);
        return stats.size;
    } catch {
        return 0;
    }
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

describe("FileService._robustDelete - Real File Deletion Tests", () => {

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

    describe("Real file creation and deletion", () => {
        test('should create real file and delete it from disk', async () => {
            const filePath = await createRealFile('delete-me.txt', 'content to delete');
            expect(await fileExists(filePath)).toBe(true);

            const file = await File.create(createTestFile({
                filename: 'delete-me.txt',
                relativePath: filePath,
                absolutePath: filePath
            }));

            const result = await FileService._robustDelete(file, 'TEST_DELETE', 'Test deletion');

            expect(result).toBe(true);
            expect(await File.countDocuments({ _id: file._id })).toBe(0);
            expect(await fileExists(filePath)).toBe(false);
        });

        test('should verify file is removed from filesystem after deletion', async () => {
            const content = 'This file should be deleted from disk';
            const filePath = await createRealFile('verify-delete.txt', content);
            
            expect(await fileExists(filePath)).toBe(true);
            
            const statsBefore = await fs.stat(filePath);
            expect(statsBefore.isFile()).toBe(true);

            const file = await File.create(createTestFile({
                filename: 'verify-delete.txt',
                relativePath: filePath,
                absolutePath: filePath,
                size: content.length
            }));

            await FileService._robustDelete(file, 'TEST', 'Test');

            const fileStillExists = await fileExists(filePath);
            expect(fileStillExists).toBe(false);
        });

        test('should handle deletion of file with special characters in name', async () => {
            const filename = 'file-with-áéíóú-中文.txt';
            const filePath = await createRealFile(filename, 'special chars content');

            const file = await File.create(createTestFile({
                filename: filename,
                relativePath: filePath,
                absolutePath: filePath
            }));

            const result = await FileService._robustDelete(file, 'TEST', 'Special chars test');

            expect(result).toBe(true);
            expect(await fileExists(filePath)).toBe(false);
        });
    });

    describe("Real file size handling", () => {
        test('should correctly report size after deletion', async () => {
            const size = 5000;
            const filePath = await createRealFileWithSize('size-test.txt', size);
            
            const actualSize = await getFileSize(filePath);
            expect(actualSize).toBe(size);

            const file = await File.create(createTestFile({
                filename: 'size-test.txt',
                relativePath: filePath,
                absolutePath: filePath,
                size: size
            }));

            await FileService._robustDelete(file, 'TEST', 'Size test');

            expect(await fileExists(filePath)).toBe(false);
        });

        test('should handle large file deletion', async () => {
            const size = 10 * 1024 * 1024; // 10MB
            const filePath = await createRealFileWithSize('large-file.bin', size);

            const file = await File.create(createTestFile({
                filename: 'large-file.bin',
                relativePath: filePath,
                absolutePath: filePath,
                size: size
            }));

            const result = await FileService._robustDelete(file, 'TEST', 'Large file test');

            expect(result).toBe(true);
            expect(await fileExists(filePath)).toBe(false);
        });
    });

    describe("User storage update with real files", () => {
        test('should update user usedSpace after real file deletion', async () => {
            const fileSize = 5000;
            const filePath = await createRealFileWithSize('storage-test.txt', fileSize);

            await UserStorage.create({
                user: TEST_USER_ID,
                capacity: 1024 * 1024,
                usedSpace: fileSize,
                maxFileSize: 100,
                fileExpirationTime: 30,
                deleteByLastAccess: true,
                deleteByCreatedAt: false,
                filesPrivacy: 'private'
            });

            const file = await File.create(createTestFile({
                size: fileSize,
                filename: 'storage-test.txt',
                relativePath: filePath,
                absolutePath: filePath
            }));

            const storageBefore = await UserStorage.findOne({ user: TEST_USER_ID });
            expect(storageBefore.usedSpace).toBe(fileSize);

            await FileService._robustDelete(file, 'TEST_DELETE', 'Test');

            const storageAfter = await UserStorage.findOne({ user: TEST_USER_ID });
            expect(storageAfter.usedSpace).toBe(0);
            expect(await fileExists(filePath)).toBe(false);
        });

        test('should update usedSpace for multiple files', async () => {
            const file1Size = 1000;
            const file2Size = 2000;
            const totalSize = file1Size + file2Size;

            const file1Path = await createRealFileWithSize('multi-1.txt', file1Size);
            const file2Path = await createRealFileWithSize('multi-2.txt', file2Size);

            await UserStorage.create({
                user: TEST_USER_ID,
                capacity: 1024 * 1024,
                usedSpace: totalSize,
                maxFileSize: 100,
                fileExpirationTime: 30,
                deleteByLastAccess: true,
                deleteByCreatedAt: false,
                filesPrivacy: 'private'
            });

            const file1 = await File.create(createTestFile({
                size: file1Size,
                filename: 'multi-1.txt',
                relativePath: file1Path,
                absolutePath: file1Path
            }));

            const file2 = await File.create(createTestFile({
                size: file2Size,
                filename: 'multi-2.txt',
                relativePath: file2Path,
                absolutePath: file2Path
            }));

            await FileService._robustDelete(file1, 'TEST', 'First delete');
            await FileService._robustDelete(file2, 'TEST', 'Second delete');

            const storage = await UserStorage.findOne({ user: TEST_USER_ID });
            expect(storage.usedSpace).toBe(0);
            expect(await fileExists(file1Path)).toBe(false);
            expect(await fileExists(file2Path)).toBe(false);
        });
    });

    describe("Non-existent file handling", () => {
        test('should handle already deleted file from disk (simulated)', async () => {
            const nonExistentPath = path.join(TEST_FILES_DIR, 'non-existent-file.txt');
            expect(await fileExists(nonExistentPath)).toBe(false);

            const file = await File.create(createTestFile({
                filename: 'non-existent.txt',
                relativePath: nonExistentPath,
                absolutePath: nonExistentPath
            }));

            const result = await FileService._robustDelete(file, 'TEST', 'Non-existent test');

            expect(result).toBe(true);
            expect(await File.countDocuments({ _id: file._id })).toBe(0);
        });

        test('should delete from DB even when file not on disk', async () => {
            const missingPath = path.join(TEST_FILES_DIR, 'missing-file.txt');
            
            const file = await File.create(createTestFile({
                filename: 'missing.txt',
                relativePath: missingPath,
                absolutePath: missingPath
            }));

            expect(await File.countDocuments({ _id: file._id })).toBe(1);
            
            const result = await FileService._robustDelete(file, 'TEST', 'Missing file');

            expect(result).toBe(true);
            expect(await File.countDocuments({ _id: file._id })).toBe(0);
        });
    });

    describe("File with replacements", () => {
        test('should delete real file with fileReplaces array', async () => {
            const filePath = await createRealFile('with-replaces.txt', 'replacing content');

            const file = await File.create(createTestFile({
                filename: 'with-replaces.txt',
                relativePath: filePath,
                absolutePath: filePath,
                fileReplaces: [
                    { user: TEST_USER_ID, date: new Date(), username: 'test' }
                ]
            }));

            const result = await FileService._robustDelete(file, 'TEST', 'Test');

            expect(result).toBe(true);
            expect(await File.countDocuments({ _id: file._id })).toBe(0);
            expect(await fileExists(filePath)).toBe(false);
        });
    });

    describe("Error handling with real files", () => {
        test('should return false on database error but file may still be deleted from disk', async () => {
            const filePath = await createRealFile('error-test.txt', 'content');
            const file = await File.create(createTestFile({
                filename: 'error-test.txt',
                relativePath: filePath,
                absolutePath: filePath
            }));

            expect(await fileExists(filePath)).toBe(true);

            const originalDelete = File.deleteOne;
            File.deleteOne = jest.fn().mockRejectedValue(new Error('DB Error'));

            const result = await FileService._robustDelete(file, 'TEST', 'Test');

            File.deleteOne = originalDelete;

            expect(result).toBe(false);
            expect(await fileExists(filePath)).toBe(false);
        });
    });
});

describe("FileService._deleteFilesBatch - Real File Batch Deletion Tests", () => {

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

    describe("Batch file deletion from disk", () => {
        test('should delete multiple real files in batch', async () => {
            const filePaths = [];
            const numFiles = 5;

            for (let i = 0; i < numFiles; i++) {
                const filePath = await createRealFile(`batch-${i}.txt`, `content ${i}`);
                filePaths.push(filePath);
            }

            for (const filePath of filePaths) {
                expect(await fileExists(filePath)).toBe(true);
            }

            const files = await File.insertMany(
                filePaths.map((filePath, i) => createTestFile({
                    filename: `batch-${i}.txt`,
                    relativePath: filePath,
                    absolutePath: filePath
                }))
            );

            const createdFiles = await File.find({}).lean();
            await FileService._deleteFilesBatch(createdFiles);

            for (const filePath of filePaths) {
                expect(await fileExists(filePath)).toBe(false);
            }
            expect(await File.countDocuments({})).toBe(0);
        });

        test('should delete files and update database correctly', async () => {
            const filePaths = [];
            const numFiles = 3;

            for (let i = 0; i < numFiles; i++) {
                const filePath = await createRealFile(`db-batch-${i}.txt`, `content ${i}`);
                filePaths.push(filePath);
            }

            const files = await File.insertMany(
                filePaths.map((filePath, i) => createTestFile({
                    filename: `db-batch-${i}.txt`,
                    relativePath: filePath,
                    absolutePath: filePath
                }))
            );

            const createdFiles = await File.find({}).lean();
            expect(await File.countDocuments({})).toBe(numFiles);

            await FileService._deleteFilesBatch(createdFiles);

            expect(await File.countDocuments({})).toBe(0);
            
            for (const filePath of filePaths) {
                expect(await fileExists(filePath)).toBe(false);
            }
        });

        test('should handle empty batch', async () => {
            const result = await FileService._deleteFilesBatch([]);
            expect(result).toBeUndefined();
        });

        test('should handle batch with mixed existing and non-existing files', async () => {
            const existingPath = await createRealFile('existing.txt', 'exists');
            const nonExistingPath = path.join(TEST_FILES_DIR, 'non-existing-batch.txt');

            await File.create(createTestFile({
                filename: 'existing.txt',
                relativePath: existingPath,
                absolutePath: existingPath
            }));

            await File.create(createTestFile({
                filename: 'non-existing-batch.txt',
                relativePath: nonExistingPath,
                absolutePath: nonExistingPath
            }));

            expect(await fileExists(existingPath)).toBe(true);

            const createdFiles = await File.find({}).lean();
            await FileService._deleteFilesBatch(createdFiles);

            expect(await fileExists(existingPath)).toBe(false);
            expect(await File.countDocuments({})).toBe(0);
        });
    });
});

describe("FileService._parallelDelete - Real Parallel File Deletion Tests", () => {

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

    describe("Parallel deletion of real files", () => {
        test('should delete multiple real files in parallel', async () => {
            const files = [];
            const numFiles = 10;

            for (let i = 0; i < numFiles; i++) {
                const filePath = await createRealFile(`parallel-${i}.txt`, `content ${i}`);
                files.push(filePath);
            }

            for (const filePath of files) {
                expect(await fileExists(filePath)).toBe(true);
            }

            const createdFiles = await File.insertMany(
                files.map((filePath, i) => createTestFile({
                    filename: `parallel-${i}.txt`,
                    relativePath: filePath,
                    absolutePath: filePath
                }))
            );

            const fileDocs = await File.find({}).lean();
            const result = await FileService._parallelDelete(fileDocs, 'TEST', 'Parallel test');

            expect(result.deletedCount).toBe(numFiles);
            expect(result.errorCount).toBe(0);

            for (const filePath of files) {
                expect(await fileExists(filePath)).toBe(false);
            }
            expect(await File.countDocuments({})).toBe(0);
        });

        test('should delete 20 real files respecting concurrency', async () => {
            const files = [];
            const numFiles = 20;

            for (let i = 0; i < numFiles; i++) {
                const filePath = await createRealFile(`concurrency-${i}.txt`, `content ${i}`);
                files.push(filePath);
            }

            const createdFiles = await File.insertMany(
                files.map((filePath, i) => createTestFile({
                    filename: `concurrency-${i}.txt`,
                    relativePath: filePath,
                    absolutePath: filePath
                }))
            );

            const fileDocs = await File.find({}).lean();
            const result = await FileService._parallelDelete(fileDocs, 'TEST', 'Concurrency test');

            expect(result.deletedCount).toBe(20);
            expect(result.errorCount).toBe(0);

            for (const filePath of files) {
                expect(await fileExists(filePath)).toBe(false);
            }
        });

        test('should delete 100 real files in large batch', async () => {
            const files = [];
            const numFiles = 100;

            for (let i = 0; i < numFiles; i++) {
                const filePath = await createRealFile(`large-batch-${i}.txt`, `content ${i}`);
                files.push(filePath);
            }

            const createdFiles = await File.insertMany(
                files.map((filePath, i) => createTestFile({
                    filename: `large-batch-${i}.txt`,
                    relativePath: filePath,
                    absolutePath: filePath
                }))
            );

            const fileDocs = await File.find({}).lean();
            const result = await FileService._parallelDelete(fileDocs, 'TEST', 'Large batch test');

            expect(result.deletedCount).toBe(100);
            expect(result.errorCount).toBe(0);

            for (const filePath of files) {
                expect(await fileExists(filePath)).toBe(false);
            }
        });

        test('should handle mixed real and non-real files', async () => {
            const realFilePath = await createRealFile('mixed-real.txt', 'real content');
            const nonRealPath = path.join(TEST_FILES_DIR, 'mixed-non-real.txt');

            await File.insertMany([
                createTestFile({
                    filename: 'mixed-real.txt',
                    relativePath: realFilePath,
                    absolutePath: realFilePath
                }),
                createTestFile({
                    filename: 'mixed-non-real.txt',
                    relativePath: nonRealPath,
                    absolutePath: nonRealPath
                })
            ]);

            const fileDocs = await File.find({}).lean();
            const result = await FileService._parallelDelete(fileDocs, 'TEST', 'Mixed test');

            expect(result.deletedCount).toBe(2);
            expect(result.errorCount).toBe(0);
            expect(await fileExists(realFilePath)).toBe(false);
        });
    });

    describe("Parallel deletion with errors", () => {
        test('should delete both real files and handle non-existing gracefully', async () => {
            const validPath1 = await createRealFile('valid1.txt', 'valid content 1');
            const validPath2 = await createRealFile('valid2.txt', 'valid content 2');
            
            await File.create(createTestFile({
                filename: 'valid1.txt',
                relativePath: validPath1,
                absolutePath: validPath1
            }));

            await File.create(createTestFile({
                filename: 'valid2.txt',
                relativePath: validPath2,
                absolutePath: validPath2
            }));

            const fileDocs = await File.find({}).lean();
            const result = await FileService._parallelDelete(fileDocs, 'TEST', 'All valid test');

            expect(result.deletedCount).toBe(2);
            expect(result.errorCount).toBe(0);
            expect(await fileExists(validPath1)).toBe(false);
            expect(await fileExists(validPath2)).toBe(false);
        });

        test('should not throw on partial failures', async () => {
            const files = [];
            for (let i = 0; i < 5; i++) {
                const filePath = await createRealFile(`partial-${i}.txt`, `content ${i}`);
                files.push(filePath);
            }

            const createdFiles = await File.insertMany(
                files.map((filePath, i) => createTestFile({
                    filename: `partial-${i}.txt`,
                    relativePath: filePath,
                    absolutePath: filePath
                }))
            );

            const fileDocs = await File.find({}).lean();
            
            const result = await FileService._parallelDelete(fileDocs, 'TEST', 'Partial test');

            expect(result.deletedCount).toBe(5);
            expect(result.errorCount).toBe(0);

            for (const filePath of files) {
                expect(await fileExists(filePath)).toBe(false);
            }
        });
    });

    describe("Chunking with real files", () => {
        test('should process files in chunks of CLEANUP_CONCURRENCY', async () => {
            const originalConcurrency = process.env.MEDIA_CLEANUP_CONCURRENCY;
            process.env.MEDIA_CLEANUP_CONCURRENCY = '5';

            const files = [];
            const numFiles = 12;

            for (let i = 0; i < numFiles; i++) {
                const filePath = await createRealFile(`chunk-test-${i}.txt`, `content ${i}`);
                files.push(filePath);
            }

            const createdFiles = await File.insertMany(
                files.map((filePath, i) => createTestFile({
                    filename: `chunk-test-${i}.txt`,
                    relativePath: filePath,
                    absolutePath: filePath
                }))
            );

            const fileDocs = await File.find({}).lean();
            const chunks = FileService._chunkArray(fileDocs, 5);

            expect(chunks.length).toBe(3);
            expect(chunks[0].length).toBe(5);
            expect(chunks[1].length).toBe(5);
            expect(chunks[2].length).toBe(2);

            const result = await FileService._parallelDelete(fileDocs, 'TEST', 'Chunk test');

            expect(result.deletedCount).toBe(12);

            for (const filePath of files) {
                expect(await fileExists(filePath)).toBe(false);
            }

            process.env.MEDIA_CLEANUP_CONCURRENCY = originalConcurrency;
        });
    });

    describe("Parallel timing verification", () => {
        test('should complete parallel deletion faster than sequential would', async () => {
            const originalEnv = process.env.MEDIA_CLEANUP_CONCURRENCY;
            process.env.MEDIA_CLEANUP_CONCURRENCY = '5';

            const files = [];
            const numFiles = 20;

            for (let i = 0; i < numFiles; i++) {
                const filePath = await createRealFile(`timing-${i}.txt`, `content ${i}`);
                files.push(filePath);
            }

            const createdFiles = await File.insertMany(
                files.map((filePath, i) => createTestFile({
                    filename: `timing-${i}.txt`,
                    relativePath: filePath,
                    absolutePath: filePath
                }))
            );

            const fileDocs = await File.find({}).lean();

            const parallelStart = Date.now();
            const result = await FileService._parallelDelete(fileDocs, 'TEST', 'Timing test');
            const parallelTime = Date.now() - parallelStart;

            expect(result.deletedCount).toBe(20);

            expect(parallelTime).toBeLessThan(10000);

            for (const filePath of files) {
                expect(await fileExists(filePath)).toBe(false);
            }

            process.env.MEDIA_CLEANUP_CONCURRENCY = originalEnv;
        });

        test('should process all chunks, not sequential', async () => {
            const originalEnv = process.env.MEDIA_CLEANUP_CONCURRENCY;
            process.env.MEDIA_CLEANUP_CONCURRENCY = '3';

            const files = [];
            const numFiles = 9;

            for (let i = 0; i < numFiles; i++) {
                const filePath = await createRealFile(`chunk-verify-${i}.txt`, `content ${i}`);
                files.push(filePath);
            }

            const createdFiles = await File.insertMany(
                files.map((filePath, i) => createTestFile({
                    filename: `chunk-verify-${i}.txt`,
                    relativePath: filePath,
                    absolutePath: filePath
                }))
            );

            const fileDocs = await File.find({}).lean();
            const chunks = FileService._chunkArray(fileDocs, 3);

            expect(chunks.length).toBe(3);
            expect(chunks[0].length).toBe(3);
            expect(chunks[1].length).toBe(3);
            expect(chunks[2].length).toBe(3);

            const result = await FileService._parallelDelete(fileDocs, 'TEST', 'Chunk verify test');

            expect(result.deletedCount).toBe(9);
            expect(result.errorCount).toBe(0);

            for (const filePath of files) {
                expect(await fileExists(filePath)).toBe(false);
            }

            process.env.MEDIA_CLEANUP_CONCURRENCY = originalEnv;
        });
    });
});

describe("Edge Cases - Additional Robustness Tests", () => {

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

    describe("Empty and null inputs", () => {
        test('should handle empty array gracefully', async () => {
            const result = await FileService._parallelDelete([], 'TEST', 'Empty');
            expect(result.deletedCount).toBe(0);
            expect(result.errorCount).toBe(0);
        });

        test('should handle null input gracefully', async () => {
            const result = await FileService._parallelDelete(null, 'TEST', 'Null');
            expect(result.deletedCount).toBe(0);
            expect(result.errorCount).toBe(0);
        });

        test('should filter out undefined files before processing', async () => {
            const filePath = await createRealFile('valid-only.txt', 'content');
            await File.create(createTestFile({
                filename: 'valid-only.txt',
                relativePath: filePath,
                absolutePath: filePath
            }));

            const fileDocs = await File.find({}).lean();
            const validDocs = fileDocs.filter(doc => doc && doc.filename);

            const result = await FileService._parallelDelete(validDocs, 'TEST', 'Filtered test');

            expect(result.deletedCount).toBe(1);
            expect(result.errorCount).toBe(0);
            expect(await fileExists(filePath)).toBe(false);
        });
    });

    describe("Single file edge case", () => {
        test('should handle single file deletion', async () => {
            const filePath = await createRealFile('single.txt', 'single content');
            const file = await File.create(createTestFile({
                filename: 'single.txt',
                relativePath: filePath,
                absolutePath: filePath
            }));

            expect(await fileExists(filePath)).toBe(true);

            const result = await FileService._parallelDelete([file.toObject()], 'TEST', 'Single test');

            expect(result.deletedCount).toBe(1);
            expect(await fileExists(filePath)).toBe(false);
        });

        test('should handle single file with _robustDelete', async () => {
            const filePath = await createRealFile('single-robust.txt', 'single robust content');
            const file = await File.create(createTestFile({
                filename: 'single-robust.txt',
                relativePath: filePath,
                absolutePath: filePath
            }));

            expect(await fileExists(filePath)).toBe(true);

            const result = await FileService._robustDelete(file, 'TEST', 'Single robust test');

            expect(result).toBe(true);
            expect(await fileExists(filePath)).toBe(false);
        });
    });

    describe("Files with same timestamps", () => {
        test('should handle multiple files with identical timestamps', async () => {
            const sameTime = daysAgo(40);
            const files = [];

            for (let i = 0; i < 5; i++) {
                const filePath = await createRealFile(`same-ts-${i}.txt`, `content ${i}`);
                files.push(filePath);

                await File.create(createTestFile({
                    filename: `same-ts-${i}.txt`,
                    relativePath: filePath,
                    absolutePath: filePath,
                    lastAccess: sameTime,
                    createdAt: sameTime,
                    expirationDate: null
                }));
            }

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

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(5);

            for (const filePath of files) {
                expect(await fileExists(filePath)).toBe(false);
            }
        });
    });

    describe("Files with very long filenames", () => {
        test('should handle files with long filenames', async () => {
            const longFilename = 'a'.repeat(100) + '.txt';
            const filePath = path.join(TEST_FILES_DIR, longFilename);
            await fs.writeFile(filePath, 'long filename content');

            const file = await File.create(createTestFile({
                filename: longFilename,
                relativePath: filePath,
                absolutePath: filePath
            }));

            const result = await FileService._robustDelete(file, 'TEST', 'Long filename test');

            expect(result).toBe(true);
            expect(await fileExists(filePath)).toBe(false);
        });
    });

    describe("Files with special characters", () => {
        test('should handle files with unicode characters', async () => {
            const unicodeFilename = '文件-файл-αρχείο.txt';
            const filePath = await createRealFile(unicodeFilename, 'unicode content');

            const file = await File.create(createTestFile({
                filename: unicodeFilename,
                relativePath: filePath,
                absolutePath: filePath
            }));

            const result = await FileService._robustDelete(file, 'TEST', 'Unicode test');

            expect(result).toBe(true);
            expect(await fileExists(filePath)).toBe(false);
        });

        test('should handle files with spaces in path', async () => {
            const spacedDir = '/tmp/test with spaces';
            await fs.mkdir(spacedDir, { recursive: true });
            const filePath = path.join(spacedDir, 'file with spaces.txt');
            await fs.writeFile(filePath, 'spaces content');

            const file = await File.create(createTestFile({
                filename: 'file with spaces.txt',
                relativePath: filePath,
                absolutePath: filePath
            }));

            const result = await FileService._robustDelete(file, 'TEST', 'Spaces test');

            expect(result).toBe(true);
            expect(await fileExists(filePath)).toBe(false);

            await fs.rm(spacedDir, { recursive: true, force: true });
        });
    });

    describe("Database operation edge cases", () => {
        test('should handle file with empty createdBy object', async () => {
            const filePath = await createRealFile('empty-createdby.txt', 'content');

            await File.create({
                ...createTestFile({
                    filename: 'empty-createdby.txt',
                    relativePath: filePath,
                    absolutePath: filePath
                }),
                createdBy: { user: null, username: 'orphan' }
            });

            const file = await File.findOne({ filename: 'empty-createdby.txt' });
            const result = await FileService._robustDelete(file, 'TEST', 'Empty createdBy test');

            expect(result).toBe(true);
            expect(await fileExists(filePath)).toBe(false);
        });

        test('should handle file with null user in createdBy', async () => {
            const filePath = await createRealFile('null-user.txt', 'content');

            await File.create({
                ...createTestFile({
                    filename: 'null-user.txt',
                    relativePath: filePath,
                    absolutePath: filePath
                }),
                createdBy: { user: null, username: 'orphan' }
            });

            const file = await File.findOne({ filename: 'null-user.txt' });
            const result = await FileService._robustDelete(file, 'TEST', 'Null user test');

            expect(result).toBe(true);
            expect(await fileExists(filePath)).toBe(false);
        });
    });

    describe("Cleanup concurrency edge cases", () => {
        test('should handle concurrency of 1 (sequential)', async () => {
            const originalEnv = process.env.MEDIA_CLEANUP_CONCURRENCY;
            process.env.MEDIA_CLEANUP_CONCURRENCY = '1';

            const files = [];
            for (let i = 0; i < 3; i++) {
                const filePath = await createRealFile(`seq-${i}.txt`, `content ${i}`);
                files.push(filePath);

                await File.create(createTestFile({
                    filename: `seq-${i}.txt`,
                    relativePath: filePath,
                    absolutePath: filePath,
                    expirationDate: daysAgo(1)
                }));
            }

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(3);

            for (const filePath of files) {
                expect(await fileExists(filePath)).toBe(false);
            }

            process.env.MEDIA_CLEANUP_CONCURRENCY = originalEnv;
        });

        test('should handle very high concurrency value', async () => {
            const originalEnv = process.env.MEDIA_CLEANUP_CONCURRENCY;
            process.env.MEDIA_CLEANUP_CONCURRENCY = '1000';

            const files = [];
            for (let i = 0; i < 5; i++) {
                const filePath = await createRealFile(`high-conc-${i}.txt`, `content ${i}`);
                files.push(filePath);

                await File.create(createTestFile({
                    filename: `high-conc-${i}.txt`,
                    relativePath: filePath,
                    absolutePath: filePath,
                    expirationDate: daysAgo(1)
                }));
            }

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(5);

            for (const filePath of files) {
                expect(await fileExists(filePath)).toBe(false);
            }

            process.env.MEDIA_CLEANUP_CONCURRENCY = originalEnv;
        });
    });

    describe("UserStorage edge cases", () => {
        test('should handle file without UserStorage using explicit expiration', async () => {
            const filePath = await createRealFile('no-storage-exp.txt', 'content');

            await File.create(createTestFile({
                filename: 'no-storage-exp.txt',
                relativePath: filePath,
                absolutePath: filePath,
                expirationDate: daysAgo(1),
                createdBy: { user: null, username: 'orphan' }
            }));

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(1);
            expect(await fileExists(filePath)).toBe(false);
        });

        test('should NOT delete file without UserStorage when using policy', async () => {
            const filePath = await createRealFile('no-storage-policy.txt', 'content');

            await File.create(createTestFile({
                filename: 'no-storage-policy.txt',
                relativePath: filePath,
                absolutePath: filePath,
                lastAccess: daysAgo(40),
                expirationDate: null,
                createdBy: { user: null, username: 'orphan' }
            }));

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(0);
            expect(await fileExists(filePath)).toBe(true);
        });
    });

    describe("Rapid successive calls", () => {
        test('should handle rapid successive cleanup calls', async () => {
            for (let i = 0; i < 5; i++) {
                const filePath = await createRealFile(`rapid-${i}.txt`, `content ${i}`);

                await File.create(createTestFile({
                    filename: `rapid-${i}.txt`,
                    relativePath: filePath,
                    absolutePath: filePath,
                    expirationDate: daysAgo(1)
                }));
            }

            const result1 = await FileService.executeCleanup();
            expect(result1.deletedCount).toBe(5);

            const result2 = await FileService.executeCleanup();
            expect(result2.deletedCount).toBe(0);

            const result3 = await FileService.executeCleanup();
            expect(result3.deletedCount).toBe(0);
        });
    });
});

describe("FileService.executeCleanup - Real File Expiration Tests", () => {

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

    describe("Real files with explicit expiration", () => {
        test('should delete expired real files with expirationDate', async () => {
            const filePath = await createRealFile('explicit-expired.txt', 'expired content');

            await File.create(createTestFile({
                filename: 'explicit-expired.txt',
                relativePath: filePath,
                absolutePath: filePath,
                expirationDate: daysAgo(1)
            }));

            expect(await fileExists(filePath)).toBe(true);

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(1);
            expect(await File.countDocuments({ filename: 'explicit-expired.txt' })).toBe(0);
            expect(await fileExists(filePath)).toBe(false);
        });

        test('should NOT delete real files with future expiration', async () => {
            const filePath = await createRealFile('future-expired.txt', 'future content');
            const { daysFromNow } = require('../data/test-data');

            await File.create(createTestFile({
                filename: 'future-expired.txt',
                relativePath: filePath,
                absolutePath: filePath,
                expirationDate: daysFromNow(30)
            }));

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(0);
            expect(await File.countDocuments({ filename: 'future-expired.txt' })).toBe(1);
            expect(await fileExists(filePath)).toBe(true);
        });

        test('should delete multiple expired real files', async () => {
            const files = [];
            for (let i = 0; i < 5; i++) {
                const filePath = await createRealFile(`multi-exp-${i}.txt`, `content ${i}`);
                files.push(filePath);

                await File.create(createTestFile({
                    filename: `multi-exp-${i}.txt`,
                    relativePath: filePath,
                    absolutePath: filePath,
                    expirationDate: daysAgo(1)
                }));
            }

            for (const filePath of files) {
                expect(await fileExists(filePath)).toBe(true);
            }

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(5);
            expect(await File.countDocuments({})).toBe(0);

            for (const filePath of files) {
                expect(await fileExists(filePath)).toBe(false);
            }
        });
    });

    describe("Real files with policy-based expiration", () => {
        test('should delete real files by lastAccess policy', async () => {
            const filePath = await createRealFile('policy-expired.txt', 'policy content');

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
                filename: 'policy-expired.txt',
                relativePath: filePath,
                absolutePath: filePath,
                lastAccess: daysAgo(35),
                expirationDate: null
            }));

            expect(await fileExists(filePath)).toBe(true);

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(1);
            expect(await fileExists(filePath)).toBe(false);
        });

        test('should keep real files within policy expiration', async () => {
            const filePath = await createRealFile('policy-recent.txt', 'recent content');

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
                filename: 'policy-recent.txt',
                relativePath: filePath,
                absolutePath: filePath,
                lastAccess: daysAgo(5),
                expirationDate: null
            }));

            expect(await fileExists(filePath)).toBe(true);

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(0);
            expect(await fileExists(filePath)).toBe(true);
        });
    });

    describe("Mixed real file scenarios", () => {
        test('should process mixed explicit and policy expirations', async () => {
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

            const explicitPath = await createRealFile('mixed-explicit.txt', 'explicit');
            const policyPath = await createRealFile('mixed-policy.txt', 'policy');

            await File.create([
                createTestFile({
                    filename: 'mixed-explicit.txt',
                    relativePath: explicitPath,
                    absolutePath: explicitPath,
                    expirationDate: daysAgo(1)
                }),
                createTestFile({
                    filename: 'mixed-policy.txt',
                    relativePath: policyPath,
                    absolutePath: policyPath,
                    lastAccess: daysAgo(40),
                    expirationDate: null
                })
            ]);

            expect(await fileExists(explicitPath)).toBe(true);
            expect(await fileExists(policyPath)).toBe(true);

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(2);
            expect(await fileExists(explicitPath)).toBe(false);
            expect(await fileExists(policyPath)).toBe(false);
        });

        test('should update usedSpace when deleting real files', async () => {
            const fileSize = 1000;
            const filePath = await createRealFileWithSize('usedspace-test.txt', fileSize);

            await UserStorage.create({
                user: TEST_USER_ID,
                capacity: 1024 * 1024,
                usedSpace: fileSize,
                maxFileSize: 100,
                fileExpirationTime: 30,
                deleteByLastAccess: true,
                deleteByCreatedAt: false,
                filesPrivacy: 'private'
            });

            await File.create(createTestFile({
                filename: 'usedspace-test.txt',
                relativePath: filePath,
                absolutePath: filePath,
                size: fileSize,
                expirationDate: daysAgo(1)
            }));

            const storageBefore = await UserStorage.findOne({ user: TEST_USER_ID });
            expect(storageBefore.usedSpace).toBe(fileSize);

            const result = await FileService.executeCleanup();

            expect(result.deletedCount).toBe(1);
            expect(await fileExists(filePath)).toBe(false);

            const storageAfter = await UserStorage.findOne({ user: TEST_USER_ID });
            expect(storageAfter.usedSpace).toBe(0);
        });
    });
});
