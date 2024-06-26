import {passwordRules, validateRegexPassword} from "./PasswordService";

require('dotenv').config()
import path from "path";
import createDirIfNotExist from "./utils/createDirIfNotExist";
import User from "../models/UserModel";
import {DefaultLogger as winston} from "@dracul/logger-backend";
import {createUserAudit} from "./UserAuditService";
import fs from "fs";
import bcryptjs from "bcryptjs";
import {UserInputError} from "apollo-server-errors";
import {hashPassword} from "./UserService";
import {Transform} from 'stream'

class StreamSizeValidator extends Transform {

    maxFileSize = process.env.AVATAR_MAX_SIZE ? process.env.AVATAR_MAX_SIZE : 2000000
    length = 0

    _transform(chunk, encoding, callback) {
        this.length += chunk.length

        if (this.length > this.maxFileSize) {
            this.destroy(new Error(`MAX_FILE_SIZE_EXCEEDED`));
            return;
        }

        this.push(chunk)
        callback()
    }
}

const storeFS = (sourceStream, dst) => {

    return new Promise((resolve, reject) => {

            const sizeValidator = new StreamSizeValidator()
            const fileWriteStream = fs.createWriteStream(dst)

            sourceStream
                .on('error', error => {

                    if (sourceStream.truncated) {
                        fs.unlinkSync(dst)
                    }

                    fileWriteStream.destroy(error)
                    sizeValidator.destroy(error)
                    sourceStream.destroy()

                    winston.error("UserService.storeFS: sourceStream error: ", error.message)
                    reject(error)
                })


            sizeValidator
                .on("error", error => {
                    winston.error("UserService.storeFS: sizeValidator error: ", error)
                    sourceStream.destroy(error)
                    fileWriteStream.destroy(error)
                    reject(error)
                })


            fileWriteStream
                .on('error', error => {
                    winston.error("UserService.storeFS: fileWriteStream error: ", error)
                    fileWriteStream.destroy()
                    sourceStream.destroy(error)
                    sizeValidator.destroy(error)
                    reject(error)
                })
                .on('finish', () => {
                    winston.info('UserService.storeFS finish successful')
                    resolve(true)
                })


            sourceStream
                .pipe(sizeValidator)
                .pipe(fileWriteStream)


        }
    )
}

export const avatarUpload = function (user, file) {

    return new Promise(async (resolve, reject) => {

        const mimetypesAllowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']

        try {

            const {filename, mimetype, encoding, createReadStream} = await file;

            if (!mimetypesAllowed.includes(mimetype)) {

                reject(new Error("MIMETYPE_NOT_ALLOWED"))
                return;
            }

            const parseFileName = path.parse(filename);
            const finalFileName = user.username + parseFileName.ext
            const dst = path.join("media", "avatar", finalFileName)

            //Store
            createDirIfNotExist(dst)

            storeFS(createReadStream(), dst).then(async () => {

                const rand = randomstring(3)
                const url = process.env.APP_API_URL + "/media/avatar/" + finalFileName + "?" + rand

                try {
                    await User.findOneAndUpdate({_id: user.id}, {avatar: finalFileName, avatarurl: url}).exec()
                    return resolve({filename, mimetype, encoding, url})
                } catch (error) {
                    winston.error("UserService.avatarUpload: update fail", error)
                    throw error
                }

            }).catch(err => {
                winston.error("UserService.avatarUpload: store fail", err)
                reject(new Error(err.message))
            })


        } catch (e) {
            winston.error("UserService.avatarUpload: store fail", e)
            reject(new Error(e.message))
        }

    })

}

function randomstring(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export const changePassword = async function (id, {currentPassword, newPassword}, actionBy = null) {

    try {
        if (!currentPassword || !newPassword) {
            throw new Error('Current password and new password must not be null or empty')
        }

        if (currentPassword === newPassword) {
            throw new UserInputError('auth.messagePasswordIsEqual', {
                inputErrors: {
                    newPassword: {properties: {message: 'auth.messagePasswordIsEqual'}}
                }
            })
        }

        if (validateRegexPassword(newPassword) === false) {
            throw new UserInputError('auth.invalidPassword', {
                inputErrors: {
                    newPassword: {properties: {message: passwordRules.requirements}}
                }
            })
        }

        let user = await User.findOne({_id: id})

        if (bcryptjs.compareSync(currentPassword, user.password)) {

            await User.findOneAndUpdate(
                {_id: id},
                {password: hashPassword(newPassword), lastPasswordChange: new Date()}, {new: true})
                .exec()

            await createUserAudit(actionBy.id, id, (actionBy.id === id) ? 'userPasswordChange' : 'adminPasswordChange')

            return {status: true, message: "Password Changed"}

        } else {
            winston.warn("UserService.changePassword: password doesnt match")
            throw new UserInputError('auth.wrongPassword',
                {
                    inputErrors: {
                        currentPassword: {properties: {message: 'auth.wrongPassword'}}
                    }
                })
        }

    } catch (e) {
        winston.error("UserService.changePassword ", e)
        throw e
    }

}
