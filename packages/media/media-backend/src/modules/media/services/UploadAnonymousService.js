import {DefaultLogger as winston} from '@dracul/logger-backend';
import path from "path";
import file from '../models/FileModel'
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
      const name = parseFileName.name
      const hash = '-' + randomString(6)
      const finalFileName = name + hash + extension
      const year = new Date().getFullYear().toString()
      const month = (new Date().getMonth() + 1).toString()
      const relativePath = path.join("media", "files", USERNAME, year, month, finalFileName)
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
          createdBy: { user: null, username: USERNAME }
        }, function (err, doc) {
          if (err){
            winston.error("Upload Fail on file.create",err)
            return rejects(err);
          }
          // saved!
          doc.execPopulate(() => (resolve(doc)))
        });

      } else {
        winston.error("Upload Fail")
        rejects(new Error("Upload Fail"))
      }

    } catch (err) {
      winston.error('UploadService: ', err)
      rejects(new Error("Upload Fail"))
    }
  })

}

export { fileUploadAnonymous }
export default fileUploadAnonymous
