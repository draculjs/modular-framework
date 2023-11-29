/**
 * @fileOverview
 * This module provides a function to store a file, performing size validation and error handling.
 * @module FileStorage
 */

import { DefaultLogger as winston } from '@dracul/logger-backend';
import { findUserStorageByUser } from "../UserStorageService";
import createDirIfNotExist from './createDirIfNotExist';

import { Transform, pipeline } from 'stream';
import util from "util";
import fs from "fs";

/**
 * Custom error class for when the maximum file size is exceeded.
 * @class
 * @extends Error
 * @param {string} message - The error message.
 */
class MaxFileSizeExceededError extends Error {
    constructor(message) {
        super(message)
        this.code = 'MAX_FILE_SIZE_EXCEEDED'
    }
}

/**
 * A Transform stream to validate the size of the incoming data chunk.
 * @class
 * @extends Transform
 * @param {number} maxFileSize - The maximum allowed file size in megabytes.
 * @param {number} storageLeft - The available storage space in megabytes.
 */
class StreamSizeValidator extends Transform {
    constructor(maxFileSize, storageLeft) {
        super()
        this.maxFileSize = maxFileSize
        this.storageLeft = storageLeft
        this.totalLength = 0
        this.error = ''
    }

    /**
     * Transform function to validate the size of each incoming chunk.
     * @param {Buffer} chunk - The data chunk to be validated.
     * @param {string} _encoding - The encoding of the chunk (not used in this implementation).
     * @param {Function} callback - The callback function to signal the completion of the transform.
     */
    _transform(chunk, _encoding, callback) {
        this.totalLength += chunk.length / (1024 * 1024)

        if (this.totalLength > this.maxFileSize) {
            this.error = new MaxFileSizeExceededError("File upload failed. The uploaded file exceeds the maximum allowed size. Please ensure your file is within the accepted size limit of " + this.maxFileSize + " MBs.")
            this.destroy(this.error)
        }

        if (this.totalLength > this.storageLeft) {
            this.error = 'STORAGE_CAPACITY_EXCEEDED'
            this.destroy(new Error("Storage capacity exceeded; available storage: " + this.storageLeft))
        }

        this.push(chunk)
        callback()
    }
}

/**
 * Asynchronously stores a file, performing size validation and utilizing user-specific storage settings.
 * @async
 * @function
 * @param {ReadableStream} fileStream - The readable stream of the file to be stored.
 * @param {string} dst - The destination path where the file will be stored.
 * @param {object} user - The user object associated with the file.
 * @throws {Error} Throws an error if any validation or storage operation fails.
 * @returns {object} An object indicating the success of the operation and the number of bytes written.
 * @property {boolean} finish - Indicates whether the file storage process completed successfully.
 * @property {number} bytesWritten - The number of bytes written to the destination.
 */
export default async function storeFile(fileStream, dst, user) {
    try {
        if (!fileStream || !fileStream.readable) throw new Error("A readable stream is required")
        if (typeof fileStream.pipe !== 'function') throw new Error("Stream needs the pipe method")
        if (!user) throw new Error("user parameter was not provided to storeFile")

        let maxFileSize = process.env.MEDIA_MAX_SIZE_PER_FILE_IN_MEGABYTES
        let storageLeft = maxFileSize

        const userStorage = await findUserStorageByUser(user)
        if (userStorage) {
            storageLeft = userStorage.capacity - userStorage.usedSpace
            maxFileSize = userStorage.maxFileSize
        }

        const sizeValidator = new StreamSizeValidator(maxFileSize, storageLeft)

        createDirIfNotExist(dst)
        const fileWriteStream = fs.createWriteStream(dst)

        const asyncPipeline = util.promisify(pipeline)
        await asyncPipeline(fileStream, sizeValidator, fileWriteStream)

        return { finish: true, bytesWritten: fileWriteStream.bytesWritten }
    } catch (error) {
        winston.error("An error happened at the storeFile function:", error)
        throw error
    }
}
