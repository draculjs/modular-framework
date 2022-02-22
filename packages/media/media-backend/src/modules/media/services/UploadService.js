import { DefaultLogger as winston } from '@dracul/logger-backend';
import path from "path";
import File from '../models/FileModel'
import storeFile from './helpers/storeFile'
import randomString from './helpers/randomString'
import baseUrl from "./helpers/baseUrl";
import { updateUserUsedStorage, findUserStorageByUser } from './UserStorageService';

const fileUpload = function (user, inputFile, expirationDate) {

  return new Promise(async (resolve, rejects) => {
    try {

      if (!user) {
        return rejects(new Error("user is required"))
      }

      const { filename, mimetype, encoding, createReadStream } = await inputFile;

      let type = mimetype.split("/")[0]

      const parseFileName = path.parse(filename);
      const extension = parseFileName.ext
      const name = parseFileName.name.replace(/#/g, "")
      const hash = '-' + randomString(6)
      const finalFileName = name + hash + extension
      const year = new Date().getFullYear().toString()
      const month = (new Date().getMonth() + 1).toString()
      const relativePath = path.join("media", "files", user.username, year, month, finalFileName)
      const absolutePath = path.resolve(relativePath);

      //Store
      let storeResult = await storeFile(createReadStream(), relativePath, user)
      winston.info("fileUploadAnonymous store result: " + storeResult)

      let expiration = new Date();

      // if (!expirationDate) {
      //   let userStorage = await findUserStorageByUser(user);
      //   const today = new Date();
      //   expiration.setDate(today.getDate() + userStorage.fileExpirationTime);
      // } else {
      //   expiration = expirationDate
      // }

      let url = baseUrl() + relativePath

      if (storeResult && storeResult.finish) {

        let fileSizeMB = storeResult.bytesWritten / (1024 * 1024)

        updateUserUsedStorage(user.id, fileSizeMB)

        let doc = new File({
          filename: finalFileName,
          mimetype: mimetype,
          encoding: encoding,
          type: type,
          extension: extension,
          relativePath: relativePath,
          absolutePath: absolutePath,
          size: fileSizeMB,
          url: url,
          createdBy: { user: user.id, username: user.username },
          expirationDate: expirationDate
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
      winston.error('UploadService error' + err)
      rejects(err)
    }
  })

}

export { fileUpload }
export default fileUpload
