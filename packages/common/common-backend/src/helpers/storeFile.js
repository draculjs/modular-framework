import fs from 'fs';
import createDirIfNotExist from './createDirIfNotExist.js';
import { DefaultLogger } from '@dracul/logger-backend';

export default function storeFile(fileStream, dst) {
    try {
        if (!fileStream.readable) throw new Error("A readeable stream is required")
        if (typeof fileStream.pipe != 'function') throw new Error("Stream needs the pipe method")
    
        return new Promise((resolve, reject) => {
            createDirIfNotExist(dst)
    
            fileStream.on('error', error => {
                if (fileStream.truncated)
                    fs.unlinkSync(dst);
                reject(error);
            })
            .pipe(fs.createWriteStream(dst))
            .on('error', error => reject(error))
            .on('finish', () => resolve(true))
            }
        )
    } catch (error) {
        DefaultLogger.error(`An error happened at storeFile: ${error}`)
    }
}