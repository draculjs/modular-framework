import Customization from '../models/CustomizationModel'
import {UserInputError} from 'apollo-server-express'
import path from "path";
import fs from "fs";
import createDirIfNotExist from "./helpers/createDirIfNotExist";


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

const storeFS = (stream, dst) => {
    return new Promise((resolve, reject) =>
        stream
            .on('error', error => {
                if (stream.truncated)
                    fs.unlinkSync(dst);
                reject(error);
            })
            .pipe(fs.createWriteStream(dst))
            .on('error', error => reject(error))
            .on('finish', () => resolve(true))
    );
}

export const uploadLogo = function (file) {

    function randomstring(length) {
        let result = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    return new Promise(async (resolve, rejects) => {

        const {filename, mimetype, encoding, createReadStream} = await file;

        const dst = path.join("media", "logo", filename)

        //Store
        createDirIfNotExist(dst)
        let fileResult = await storeFS(createReadStream(), dst)

        if (fileResult) {

            const rand = randomstring(3)
            const url = process.env.APP_API_URL + "/media/logo/" + filename + "?" + rand

            let logo = {filename, url}

            Customization.findOneAndUpdate(
                {}, {$set: {'logo.filename': filename, 'logo.url': url}}, {useFindAndModify: false},
                (error) => {
                    if (error) rejects(new Error("Save Fail"))
                    else resolve({filename, mimetype, encoding, url})
                }
            );

        } else {
            rejects(new Error("Upload Fail"))
        }

    })

}


