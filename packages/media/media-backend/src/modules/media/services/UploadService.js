import {DefaultLogger as winston} from '@dracul/logger-backend';
import path from "path";
import File from '../models/FileModel'
import storeFile from './helpers/storeFile'
import randomString from './helpers/randomString'
import baseUrl from "./helpers/baseUrl";

const fileUpload = function (user, inputFile) {

  return new Promise(async (resolve, rejects) => {
    try {

      if(!user){
        return rejects(new Error("user is required"))
      }

      const { filename, mimetype, encoding, createReadStream } = await inputFile;

      let type = mimetype.split("/")[0]

      const parseFileName = path.parse(filename);
      const extension = parseFileName.ext
      const name = parseFileName.name
      const hash = '-' + randomString(6)
      const finalFileName = name + hash + extension
      const year = new Date().getFullYear().toString()
      const month = (new Date().getMonth() + 1).toString()
      const relativePath = path.join("media", "files", user.username, year, month, finalFileName)
      const absolutePath = path.resolve(relativePath);

      //Store
      let storeResult = await storeFile(createReadStream(), relativePath)

      winston.info("fileUploadAnonymous store result: " + storeResult)

      let url = baseUrl() + relativePath

      if (storeResult && storeResult.finish) {

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
          createdBy: { user: user.id, username: user.username }
        })

        winston.info("fileUploadAnonymous saving file")
        await doc.save()
        winston.info("fileUploadAnonymous file saved: " + doc._id)

        doc.populate('createdBy.user').execPopulate(() => (resolve(doc)))

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

export { fileUpload }
export default fileUpload
