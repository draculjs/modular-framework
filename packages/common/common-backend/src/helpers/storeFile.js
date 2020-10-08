const fs = require('fs');
const createDirIfNotExist = require('./createDirIfNotExist')

const storeFile = function (fileStream, dst) {

    if (!fileStream.readable) {
        throw new Error("A redeable stream is required")
    }

    if (typeof fileStream.pipe != 'function') {
        throw new Error("Stream needs the pipe method")
    }

    return new Promise((resolve, reject) => {

            createDirIfNotExist(dst)

            fileStream
                .on('error', error => {
                    if (fileStream.truncated)
                        fs.unlinkSync(dst);
                    reject(error);
                })
                .pipe(fs.createWriteStream(dst))
                .on('error', error => reject(error))
                .on('finish', () => resolve(true))
        }
    );
}

module.exports.storeFile = storeFile
module.exports = storeFile