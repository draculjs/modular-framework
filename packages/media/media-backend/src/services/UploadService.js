import { DefaultLogger as winston } from '@dracul/logger-backend';
import path from "path";
import File from '../models/FileModel'
import storeFile from './helpers/storeFile'
import randomString from './helpers/randomString'
import baseUrl from "./helpers/baseUrl";
import { updateUserUsedStorage, findUserStorageByUser } from './UserStorageService';

const fileUpload = function (user, inputFile, expirationDate, isPublic = false, description, tags, groups, users) {
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

      if (expirationDate) {
        let timeDiffExpirationDate = validateExpirationDate(expirationDate)

        if (!timeDiffExpirationDate) {
          winston.error("Expiration date must be older than current date")
          return rejects(new Error("Expiration date must be older than current date"))
        }

        let userStorage = await findUserStorageByUser(user)

        if (timeDiffExpirationDate > userStorage.fileExpirationTime) {
          winston.error(`File expiration can not be longer than max user expiration time per file (${userStorage.fileExpirationTime} days)`)
          return rejects(new Error(`File expiration can not be longer than max user expiration time per file (${userStorage.fileExpirationTime} days)`))
        }
      }

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
          expirationDate: expirationDate,
          isPublic: isPublic,
          description: description,
          tags: tags,
          groups: groups,
          users: users
        });
        winston.info("fileUploadAnonymous saving file")
        await doc.save()
        winston.info("fileUploadAnonymous file saved: " + doc._id)

        doc.populate('createdBy.user').execPopulate(() => (resolve(doc)))

      } else {
        winston.error("Upload Fail")
        return  rejects(new Error("Upload Fail"))
      }

    } catch (err) {
      winston.error('UploadService error' + err)
      return  rejects(err)
    }
  })

}

function validateExpirationDate(expirationTime) {
  const today = new Date();
  const expirationDate = new Date(expirationTime);
  if (expirationDate > today) {
    return ((expirationDate - today) / (1000 * 3600 * 24)).toFixed(2);
  }
  return null;
}


export { fileUpload }
export default fileUpload
