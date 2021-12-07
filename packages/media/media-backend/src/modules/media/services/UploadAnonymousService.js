import {DefaultLogger as winston} from '@dracul/logger-backend';
import path from "path";
import File from '../models/FileModel'
import storeFile from './helpers/storeFile'
import randomString from './helpers/randomString'
import baseUrl from "./helpers/baseUrl";

const fileUploadAnonymous = function (inputFile) {

  return new Promise(async (resolve, rejects) => {
    try {

      const USERNAME = 'system'

      const { filename, mimetype, encoding, createReadStream } = await inputFile;

      let type = mimetype.split("/")[0]

      const parseFileName = path.parse(filename);
      const extension = parseFileName.ext
      const name = parseFileName.name.replace(/#/g,"")
      const hash =   '-' + randomString(6)
      const finalFileName =  name + hash + extension
      const year = new Date().getFullYear().toString()
      const month = (new Date().getMonth() + 1).toString()
      const relativePath = path.join("media", "files", USERNAME, year, month, finalFileName)
      const absolutePath = path.resolve(relativePath);

      //Store
      let storeResult = await storeFile(createReadStream(), relativePath)

      winston.info("fileUploadAnonymous store result: " + storeResult)

      if (storeResult && storeResult.finish) {

        let url = baseUrl() + relativePath

        let doc = new File({
          filename: finalFileName,
          mimetype: mimetype,
          encoding: encoding,
          type: type,
          extension: extension,
          relativePath: relativePath,
          absolutePath: absolutePath,
          size: storeResult.bytesWritten,
          url: url,
          createdBy: { user: null, username: USERNAME }
        })

        winston.info("fileUploadAnonymous saving file")
        await doc.save()
        winston.info("fileUploadAnonymous file saved: " + doc._id)

        return resolve(doc)

      } else {
        winston.error("fileUploadAnonymous store fail")
        rejects(new Error("Upload Fail"))
      }

    } catch (err) {
      winston.error('fileUploadAnonymous', err)
      rejects(new Error("Upload Fail"))
    }
  })

}

export { fileUploadAnonymous }
export default fileUploadAnonymous
