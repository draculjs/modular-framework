import Settings from '../models/SettingsModel'
import {UserInputError} from 'apollo-server-express'

export const findSettings = async function (id) {
    return new Promise((resolve, reject) => {
        Settings.findOne({_id: id}).exec((err, res) => (
            err ? reject(err) : resolve(res)
        ));
    })
}

export const findSettingsByKey = async function (key) {
    return new Promise((resolve, reject) => {
        Settings.findOne({key: key}).exec((err, res) => (
            err ? reject(err) : resolve(res)
        ));
    })
}

export const fetchSettings = async function () {
    return new Promise((resolve, reject) => {
        Settings.find({}).exec((err, res) => (
            err ? reject(err) : resolve(res)
        ));
    })
}

export const paginateSettings = function ( pageNumber = 1, itemsPerPage = 5, search = null, orderBy = null, orderDesc = false) {

    function qs(search) {
        let qs = {}
        if (search) {
            qs = {
                $or: [
                    {key: {$regex: search, $options: 'i'}},
{value: {$regex: search, $options: 'i'}}
                ]
            }
        }
        return qs
    }

     function getSort(orderBy, orderDesc) {
        if (orderBy) {
            return (orderDesc ? '-' : '') + orderBy
        } else {
            return null
        }
    }

    let query = qs(search)
    let populate = null
    let sort = getSort(orderBy, orderDesc)
    let params = {page: pageNumber, limit: itemsPerPage, populate, sort}

    return new Promise((resolve, reject) => {
        Settings.paginate(query, params).then(result => {
                resolve({items: result.docs, totalItems: result.totalDocs, page: result.page})
            }
        ).catch(err => reject(err))
    })
}





export const createSettings = async function (authUser, {key, value, label}) {

    const doc = new Settings({
        key, value, label
    })
    doc.id = doc._id;
    return new Promise((resolve, rejects) => {
        doc.save((error => {

            if (error) {
                if (error.name == "ValidationError") {
                    return rejects(new UserInputError(error.message, {inputErrors: error.errors}));
                }
                return rejects(error)
            }

            resolve(doc)
        }))
    })
}

export const updateSettings = async function (authUser, id, {key, value, label}) {
    return new Promise((resolve, rejects) => {
        Settings.findOneAndUpdate({_id: id},
        {key, value, label},
        {new: true, runValidators: true, context: 'query'},
        (error,doc) => {

            if (error) {
                if (error.name == "ValidationError") {
                 return rejects(new UserInputError(error.message, {inputErrors: error.errors}));

                }
                return rejects(error)

            }

            resolve(doc)
        })
    })
}

export const deleteSettings = function (id) {
    return new Promise((resolve, rejects) => {
        findSettings(id).then((doc) => {
            doc.delete(function (err) {
                err ? rejects(err) : resolve({id: id, success: true})
            });
        })
    })
}

