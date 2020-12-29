import Customization from '../models/CustomizationModel'
import {UserInputError} from 'apollo-server-express'
const path = require('path');
import fs from "fs";
import createDirIfNotExist from "./helpers/createDirIfNotExist";
import { DefaultLogger as winston} from "@dracul/logger-backend";
import {Transform} from "stream";

export const findCustomization = async function () {
    return new Promise((resolve, reject) => {
        Customization.findOne().exec((err, res) => {
                err ? reject(err) : resolve(res)
            }
        );
    })
}


export const createCustomization = async function ({colors, logo, language}) {

    const doc = new Customization({
        colors, logo, language
    })
    doc.id = doc._id;
    return new Promise((resolve, rejects) => {
        doc.save((error => {
            if (error) {
                if (error.name == "ValidationError") {
                    rejects(new UserInputError(error.message, {inputErrors: error.errors}));
                }
                rejects(error)
            }
            resolve(doc)
        }))
    })
}

export const updateCustomization = async function (id, {colors, logo, language}) {
    return new Promise((resolve, rejects) => {
        Customization.findOneAndUpdate({_id: id},
            {colors, logo, language},
            {new: true, runValidators: true, context: 'query'},
            (error, doc) => {
                if (error) {
                    if (error.name == "ValidationError") {
                        rejects(new UserInputError(error.message, {inputErrors: error.errors}));
                    }
                    rejects(error)
                }

                resolve(doc)
            })
    })
}

export const updateColors = async function ({primary, onPrimary, secondary, onSecondary}) {
    return new Promise((resolve, rejects) => {
        let colors = {primary, onPrimary, secondary, onSecondary}
        Customization.findOneAndUpdate({},
            {colors},
            {new: true, runValidators: true, context: 'query', useFindAndModify: false},
            (error, doc) => {

                if (error) {
                    if (error.name == "ValidationError") {
                        rejects(new UserInputError(error.message, {inputErrors: error.errors}));
                    }
                    rejects(error)
                }
                resolve(doc.colors)
            })
    })
}

export const updateLogo = async function ({mode, title}) {
    return new Promise((resolve, rejects) => {
        Customization.findOneAndUpdate({},
            {$set: {'logo.mode': mode, 'logo.title': title}},
            {new: true, runValidators: true, context: 'query', useFindAndModify: false},
            (error, doc) => {

                if (error) {
                    if (error.name == "ValidationError") {
                        rejects(new UserInputError(error.message, {inputErrors: error.errors}));
                    }
                    rejects(error)
                }
                resolve(doc.logo)
            })
    })
}

export const updateLang = async function ({language}) {
    return new Promise((resolve, rejects) => {
        Customization.findOneAndUpdate({},
            {language},
            {new: true, runValidators: true, context: 'query'},
            (error, doc) => {

                if (error) {
                    if (error.name == "ValidationError") {
                        rejects(new UserInputError(error.message, {inputErrors: error.errors}));
                    }
                    rejects(error)
                }

                resolve(doc)
            })
    })
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

function randomstring(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export const uploadLogo = function (file) {

    return new Promise(async (resolve, reject) => {

        const mimetypesAllowed = ['image/jpeg','image/jpg','image/png','image/gif']

        try {

            const {filename, mimetype, encoding, createReadStream} = await file;

            if(!mimetypesAllowed.includes(mimetype)){
                reject(new Error("MIMETYPE_NOT_ALLOWED"))
                return
            }

            const dst = path.join("media", "logo", filename);

            //Store
            createDirIfNotExist(dst)

            storeFS(createReadStream(), dst).then(() => {

                const rand = randomstring(3)
                const url = process.env.APP_API_URL + "/media/logo/" + filename + "?" + rand

                let logo = {filename, url}

                Customization.findOneAndUpdate(
                    {}, {$set: {'logo.filename': filename, 'logo.url': url}}, {useFindAndModify: false},
                    (error) => {
                        if (error) {
                            winston.error("CustomizationService.logoUpload: update fail", error)
                            reject(new Error("Save Fail"))
                        }
                        else {
                            winston.debug('CustomizationService.logoUpload successful')
                            resolve({filename, mimetype, encoding, url})
                        }
                    }
                );
                ////////////////

            }).catch(err => {
                winston.error("UserService.avatarUpload: store fail", err)
                reject(new Error(err.message))
            })




        } catch (e) {
            winston.error("CustomizationService.logoUpload: store fail", e)
            console.log("ERRRR",e.message);
            reject(new Error(e.message))
        }

    })

}


