import fs from "fs";
import {Transform} from 'stream'
import {DefaultLogger as winston} from '@dracul/logger-backend';
import {findUserStorageByUser} from "../UserStorageService";


const createDirIfNotExist = require('./createDirIfNotExist')

class StreamSizeValidator extends Transform {

    constructor(maxFileSize, storageLeft) {
        super();
        this.maxFileSize = maxFileSize
        this.storageLeft = storageLeft
        this.totalLength = 0
        this.error = ''
    }


    _transform(chunk, encoding, callback) {

        this.totalLength += chunk.length / (1024 * 1024)
        if (this.totalLength > this.maxFileSize) {
            this.error = 'MAX_FILE_SIZE_EXCEEDED';
            winston.error("storeFile.StreamSizeValidator: _transform error: " + this.error)
            this.destroy(new Error(this.error));
            return
        }
        if (this.totalLength > this.storageLeft) {
            this.error = 'STORAGE_CAPACITY_EXCEEDED';
            winston.error("storeFile.StreamSizeValidator: _transform error: " + this.error)
            this.destroy(new Error(this.error));
            return
        }

        this.push(chunk)
        callback()
    }
}


const storeFile = function (fileStream, dst, user) {
    if (!fileStream.readable) {
        throw new Error("A redeable stream is required")
    }

    if (typeof fileStream.pipe != 'function') {
        throw new Error("Stream needs the pipe method")
    }

    return new Promise(async (resolve, reject) => {

            let maxFileSize = process.env.MEDIA_MAX_SIZE_PER_FILE_IN_MEGABYTES
            let storageLeft = maxFileSize

            if (user) {
                const userStorage = await findUserStorageByUser(user)
                if (userStorage) {
                    storageLeft = userStorage.capacity - userStorage.usedSpace
                    maxFileSize = userStorage.maxFileSize
                }
            }


            const sizeValidator = new StreamSizeValidator(maxFileSize,storageLeft)

            createDirIfNotExist(dst)

            const fileWriteStream = fs.createWriteStream(dst)

            fileStream
                .on('error', error => {

                    if (fileStream.truncated) {
                        fs.unlinkSync(dst);
                    }

                    return reject(error);
                })

            sizeValidator
                .on("error", error => {
                    return reject(error)
                })

            fileStream
                .pipe(sizeValidator)
                .pipe(fileWriteStream)
                .on('error', error => reject(error))
                .on('finish', () => {
                    resolve({finish: true, bytesWritten: fileWriteStream.bytesWritten})
                })
        }
    );
};

module.exports.storeFile = storeFile
module.exports = storeFile
