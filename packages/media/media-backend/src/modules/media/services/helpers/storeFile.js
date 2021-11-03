import fs from "fs";
import { Transform } from 'stream'
import { DefaultLogger as winston } from '@dracul/logger-backend';
import { checkUserStorageLeft } from "../UserStorageService";
const CacheBase = require('cache-base');
const app = new CacheBase();


const createDirIfNotExist = require('./createDirIfNotExist')

class StreamSizeValidator extends Transform {
    //aca va la capacidad max por usuario
    maxFileSize = process.env.MAX_SIZE_PER_FILE_IN_MEGABYTES ? process.env.MAX_SIZE_PER_FILE_IN_MEGABYTES : 1000;
    totalLength = 0;
    error = '';
    storageLeft = app.get("storageLeft")

    _transform(chunk, encoding, callback) {

        this.totalLength += chunk.length/(1024*1024)
        console.log("compara", this.totalLength, this.maxFileSize, this.storageLeft)
        if (this.totalLength > this.maxFileSize) {
            this.error = 'MAX_FILE_SIZE_EXCEEDED';
            console.log("en111")
            winston.error("storeFile.StreamSizeValidator: _transform error: ", this.error)
            this.destroy(new Error(this.error));
            return;
        }
        if (this.totalLength > this.storageLeft){
            this.error = 'STORAGE_CAPACITY_EXCEEDED';
            console.log("en222222")
            winston.error("storeFile.StreamSizeValidator: _transform error: ", this.error)
            this.destroy(new Error(this.error));
            return;
        }

        this.push(chunk)
        callback()
    }
}


const storeFile = function (fileStream, dst, userId) {
    if (!fileStream.readable) {
        throw new Error("A redeable stream is required")
    }

    if (typeof fileStream.pipe != 'function') {
        throw new Error("Stream needs the pipe method")
    }
    
    return new Promise(async (resolve, reject) => {
        let storageLeft = await checkUserStorageLeft(userId)
        app.set("storageLeft",storageLeft)
        
        const sizeValidator = new StreamSizeValidator()

        createDirIfNotExist(dst)
        const fileWriteStream = fs.createWriteStream(dst)

        fileStream
            .on('error', error => {

                if (fileStream.truncated) {
                    fs.unlinkSync(dst);
                }

                //sizeValidator.destroy(error)
                winston.error("storeFile.storeFile: fileStream error: ", error)
                reject(error);
            })

        sizeValidator
            .on("error", error => {
                winston.error("storeFile.storeFile: sizeValidator error: ", error)
                //fileStream.destroy(error)
                reject(error)
            })

        fileStream
            .pipe(sizeValidator)
            .pipe(fileWriteStream)
            .on('error', error => reject(error))
            .on('finish', () => {
                resolve({ finish: true, bytesWritten: fileWriteStream.bytesWritten })})
    }
    );
};

module.exports.storeFile = storeFile
module.exports = storeFile