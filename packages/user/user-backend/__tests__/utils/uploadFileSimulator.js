const fs = require('fs')
var mime = require('mime-types')

const uploadFileSimulator = (filePath) => {

    let mimetype = mime.lookup(filePath)
    let encoding = '7bit'
    let filePathSplited = filePath.split("/")
    let filename = filePathSplited[filePathSplited.length - 1]
    let createReadStream = () => fs.createReadStream(filePath)

    const file = {
        filename,
        mimetype,
        encoding,
        createReadStream
    };


    return file
}

export default uploadFileSimulator