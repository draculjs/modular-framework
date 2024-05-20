import Customization from '../models/CustomizationModel'
import {UserInputError} from 'apollo-server-errors'

const path = require('path');
import fs from "fs";
import createDirIfNotExist from "./helpers/createDirIfNotExist";
import {DefaultLogger as winston} from "@dracul/logger-backend";
import {randomString} from "@dracul/common-backend";
import {Transform} from "stream";

export const findCustomization = async function () {

    try {
        const customization = await Customization.findOne().exec()
        return customization
    } catch (e) {
        throw e
    }
}


export const createCustomization = async function ({lightTheme, darkTheme, logo, language}) {

    try {
        const customization = new Customization({
            lightTheme, darkTheme, logo, language
        })
        customization.id = customization._id;
        await customization.save()
        return customization
    } catch (error) {
        if (error.name == "ValidationError") {
            throw new UserInputError(error.message, {inputErrors: error.errors})
        }
        throw error
    }

}

export const updateCustomization = async function ({lightTheme, darkTheme, logo, language}) {
    try {
        const customization = await Customization.findOneAndUpdate({},
            {lightTheme, darkTheme, logo, language},
            {new: true, runValidators: true, context: 'query'}).exec()
        return customization
    } catch (e) {
        throw e
    }
}

export const updateColors = async function ({lightTheme, darkTheme}) {

    try {
        const customization = await Customization.findOneAndUpdate({},
            {lightTheme, darkTheme},
            {new: true, runValidators: true, context: 'query'}).exec()
        return customization
    } catch (e) {
        throw e
    }

}

export const updateLogo = async function ({mode, title}) {

    try {
        const customization = await Customization.findOneAndUpdate({},
            {$set: {'logo.mode': mode, 'logo.title': title}},
            {new: true, runValidators: true, context: 'query'}).exec()
        return customization.logo
    } catch (e) {
        throw e
    }

}

export const updateLang = async function ({language}) {

    try {
        const customization = await Customization.findOneAndUpdate({},
            {language},
            {new: true, runValidators: true, context: 'query'}).exec()
        return customization
    } catch (e) {
        throw e
    }

}

class StreamSizeValidator extends Transform {

    maxFileSize = process.env.LOGO_MAX_SIZE ? process.env.LOGO_MAX_SIZE : 2000000
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

                    winston.error("CustomizationService.storeFS: sourceStream error: ", error.message)
                    reject(error)
                })


            sizeValidator
                .on("error", error => {
                    winston.error("CustomizationService.storeFS: sizeValidator error: ", error)
                    sourceStream.destroy(error)
                    fileWriteStream.destroy(error)
                    reject(error)
                })


            fileWriteStream
                .on('error', error => {
                    winston.error("CustomizationService.storeFS: fileWriteStream error: ", error)
                    fileWriteStream.destroy()
                    sourceStream.destroy(error)
                    sizeValidator.destroy(error)
                    reject(error)
                })
                .on('finish', () => {
                    winston.info('CustomizationService.storeFS finish successful')
                    resolve(true)
                })

            sourceStream
                .pipe(sizeValidator)
                .pipe(fileWriteStream)
        }
    )
}


export const uploadLogo = function (file) {

    return new Promise(async (resolve, reject) => {

        const mimetypesAllowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg']

        try {

            const {filename, mimetype, encoding, createReadStream} = await file;

            if (!mimetypesAllowed.includes(mimetype)) {
                reject(new Error("MIMETYPE_NOT_ALLOWED"))
                return
            }

            const dst = path.join("media", "logo", filename);

            //Store
            createDirIfNotExist(dst)

            storeFS(createReadStream(), dst).then(async () => {

                const rand = randomString(3)
                const url = process.env.APP_API_URL + "/media/logo/" + filename + "?" + rand

                let logo = {filename, url}

                try {
                    await Customization.findOneAndUpdate({}, {
                        $set: {
                            'logo.filename': filename,
                            'logo.url': url
                        }
                    }).exec()
                    return resolve({filename, mimetype, encoding, url})
                } catch (e) {
                    winston.error("CustomizationService.logoUpload: update fail", e)
                    throw e
                }


            }).catch(err => {
                winston.error("CustomizationService.logoUpload: store fail", err)
                reject(new Error(err.message))
            })


        } catch (e) {
            winston.error("CustomizationService.logoUpload: store fail", e)
            console.log("ERRRR", e.message);
            reject(new Error(e.message))
        }

    })

}


