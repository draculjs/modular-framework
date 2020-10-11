import path from "path";
import fs from "fs";
import file from '../models/FileModel'
import storeFile from './helpers/storeFile'
import randomString from './helpers/randomString'

const baseUrl = function () {
    let url = process.env.APP_API_URL

    if (!/^http:\/\//.test(url)) {
        url = "http://" + baseUrl
    }

    if (!/\/$/.test(url)) {
        url += "/"
    }

    return url
}

const fileUpload = function (user, inputFile) {

    return new Promise(async (resolve, rejects) => {

        console.log("inputFile",inputFile)
        const {filename, mimetype, encoding, createReadStream} = await inputFile;

        let type = mimetype.split("/")[0]

        const parseFileName = path.parse(filename);
        const extension = parseFileName.ext
        const name = parseFileName.name
        const hash = '-' + randomString(6)
        const finalFileName = name + hash + extension
        const year = new Date().getFullYear().toString()
        const month = (new Date().getMonth() + 1).toString()
        const relativePath = path.join("media", "files", user.username, year,month, finalFileName)
        const absolutePath = path.resolve(relativePath);

        //Store
        let storeResult = await storeFile(createReadStream(), relativePath)

        let url = baseUrl() + relativePath

        if (storeResult && storeResult.finish) {

            file.create({
                filename: finalFileName,
                mimetype: mimetype,
                encoding: encoding,
                type: type,
                extension: extension,
                relativePath: relativePath,
                absolutePath: absolutePath,
                size: storeResult.bytesWritten,
                url: url,
                createdBy: {user: user.id, username: user.username}
            }, function (err, doc) {
                if (err) return rejects(err);
                // saved!
                doc.populate('createdBy.user').execPopulate(() => (resolve(doc)))
            });

        } else {
            rejects(new Error("Upload Fail"))
        }

    })

}

export {fileUpload}
export default fileUpload