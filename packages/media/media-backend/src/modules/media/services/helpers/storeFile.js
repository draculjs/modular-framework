import fs from "fs";
import { Transform } from 'stream'
import { DefaultLogger as winston } from '@dracul/logger-backend';
import convertGigabytesToBytes from "./convertGigabytesToBytes"


const createDirIfNotExist = require('./createDirIfNotExist')

class StreamSizeValidator extends Transform {

    maxFileSize = convertGigabytesToBytes(process.env.MAX_SIZE_PER_FILE_IN_GIGABYTES ? process.env.MAX_SIZE_PER_FILE_IN_GIGABYTES : 4);
    totalLength = 0;
    error = '';

    _transform(chunk, encoding, callback) {
        this.totalLength += chunk.length

        if (this.totalLength > this.maxFileSize) {
            this.error = 'MAX_FILE_SIZE_EXCEEDED';
            winston.error("storeFile.StreamSizeValidator: _transform error: ", this.error)
            this.destroy(new Error(this.error));
            return;
        }

        this.push(chunk)
        callback()
    }
}


const storeFile = function (fileStream, dst) {
    console.log(fileStream)
    if (!fileStream.readable) {
        throw new Error("A redeable stream is required")
    }

    if (typeof fileStream.pipe != 'function') {
        throw new Error("Stream needs the pipe method")
    }

    return new Promise((resolve, reject) => {

        const sizeValidator = new StreamSizeValidator()

        createDirIfNotExist(dst)
        const fileWriteStream = fs.createWriteStream(dst)

        fileStream
            .on('error', error => {

                if (fileStream.truncated) {
                    fs.unlinkSync(dst);
                }

                sizeValidator.destroy(error)
                winston.error("storeFile.storeFile: fileStream error: ", error.message)
                reject(error);
            })

        sizeValidator
            .on("error", error => {
                winston.error("storeFile.storeFile: sizeValidator error: ", error)
                fileStream.destroy(error)
                reject(error)
            })

        fileStream
            .pipe(sizeValidator)
            .pipe(fileWriteStream)
            .on('error', error => reject(error))
            .on('finish', () => resolve({ finish: true, bytesWritten: fileWriteStream.bytesWritten }))
    }
    );
};

module.exports.storeFile = storeFile
module.exports = storeFile