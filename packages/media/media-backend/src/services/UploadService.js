import { updateUserUsedStorage, findUserStorageByUser } from './UserStorageService';
import randomString from './helpers/randomString';
import storeFile, { expirationDateMustBeOlderError } from './helpers/storeFile';
import baseUrl from "./helpers/baseUrl";
import File from '../models/FileModel';

import { DefaultLogger as winston } from '@dracul/logger-backend';
import path from "path";


const fileUpload = async function (user, inputFile, expirationDate, isPublic, description, tags, groups, users) {
  try {
    if (!user) throw new Error("user is required")

    let { filename, mimetype, encoding, createReadStream } = await inputFile
    filename = filename.replace(/ /g, '_')
    const type = mimetype.split("/")[0]

    const parseFileName = path.parse(filename);
    const extension = parseFileName.ext
    const name = parseFileName.name.replace(/#/g, "")
    const hash = '-' + randomString(6)
    const finalFileName = name + hash + extension
    const year = new Date().getFullYear().toString()
    const month = (new Date().getMonth() + 1).toString()
    const relativePath = path.join("media", "files", user.username, year, month, finalFileName)
    const absolutePath = path.resolve(relativePath);

    const storeResult = await storeFile(createReadStream(), relativePath, user)
    winston.info("fileUpload: " + storeResult)

    const userStorage = await findUserStorageByUser(user)

    if (expirationDate) {
      let timeDiffExpirationDate = validateExpirationDate(expirationDate)

      if (!timeDiffExpirationDate) {
        winston.error("Expiration date must be older than current date")
        throw new expirationDateMustBeOlderError("Expiration date must be older than current date")
      }


      if (timeDiffExpirationDate > userStorage.fileExpirationTime) {
        winston.error(`File expiration can not be longer than max user expiration time per file (${userStorage.fileExpirationTime} days)`)
        throw new Error(`File expiration can not be longer than max user expiration time per file (${userStorage.fileExpirationTime} days)`)
      }
    }

    let url = baseUrl() + relativePath

    if (storeResult && storeResult.finish) {

      let fileSizeMB = storeResult.bytesWritten / (1024 * 1024)

      updateUserUsedStorage(user.id, fileSizeMB)

      const doc = new File({
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
        isPublic: isPublic ?? (userStorage.filesPrivacy === 'public'),
        description: description,
        tags: tags,
        groups: groups,
        users: users
      })

      await doc.save()
      winston.info("fileUpload file saved: " + doc._id)
      return doc
    }

  } catch (error) {
    winston.error('An error happened at uploadService: ' + error)
    throw error
  }

}

function validateExpirationDate(expirationTime) {
  const today = new Date();
  const expirationDate = new Date(expirationTime);
  if (expirationDate > today) {
    return ((expirationDate - today) / (1000 * 3600 * 24)).toFixed(2)
  }
  return null
}


export { fileUpload };
export default fileUpload;
