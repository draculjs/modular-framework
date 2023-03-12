import Settings from '../models/SettingsModel'
import {mongoose} from '@dracul/common-backend'
import {UserInputError} from 'apollo-server-express'

export const initializeSettings = async function (settings = []) {

    if(!Array.isArray(settings)){
        throw new Error('Settings must be an Array')
    }

    let settingsDoc = []

    for (let setting of settings) {

        let settingDoc = await initializeSetting(setting)

        settingsDoc.push(settingDoc)
    }

    return settingsDoc
}


export const initializeSetting = async function (setting) {

    if(!(setting instanceof Object)) throw new Error('Setting must be an Object')
    if(!setting.key) throw new Error('Setting must have a key')
    if(!setting.label) throw new Error('Setting must have a label')

    let settingDoc = await createOrUpdateSettings(null, setting)

    return settingDoc
}


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

export const getSettingsValueByKey = async function (key) {
    return new Promise((resolve, reject) => {
        Settings.findOne({key: key})
            .exec(
                (err, doc) => {
                    if(err) return reject(err)
                    if(['numberList', 'stringList','enumList'].includes(doc.type)) return resolve(doc.valueList)
                    return resolve(doc.value)
        }

        );
    })
}

export const findSettingsByKeys = async function (keys = []) {
    return new Promise((resolve, reject) => {

        Settings.find({key: {$in: keys}}).exec((err, docs) => {

                if (err) return reject(err)

                let settings = {}
                docs.forEach(doc => {
                    settings[doc.key] = doc
                })

                resolve(settings)
            }
        );
    })
}

export const fetchSettings = async function () {
    return new Promise((resolve, reject) => {
        Settings.find({}).exec((err, res) => (
            err ? reject(err) : resolve(res)
        ));
    })
}

export const paginateSettings = function (pageNumber = 1, itemsPerPage = 5, search = null, orderBy = null, orderDesc = false) {

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

export const createOrUpdateSettings = async (authUser, {key, entityText, entityValue, value, valueList, label, type, group, options, regex, entity, field}) => {
    const setting = await Settings.findOne({key})
    if(setting){
        setting.entityText = entityText
        setting.entityValue = entityValue
        setting.label = label
        setting.group = group
        setting.type = type
        setting.options = options
        setting.regex = regex
        setting.entity = entity
        setting.field = field

        return new Promise((resolve, rejects) => {
            setting.save((error => {

                if (error) {
                    if (error.name == "ValidationError") {
                        return rejects(new UserInputError(error.message, {inputErrors: error.errors}));
                    }
                    return rejects(error)
                }

                resolve(setting)
            }))
        })
    }

    const docValue = value ? value.toString() : null
    const docValueList = valueList ? valueList.map(i => i.toString()) : []

    const newSetting = new Settings({
        key,
        entityText,
        entityValue,
        value: docValue,
        valueList: docValueList,
        label,
        group: group ? group : 'General',
        type,
        options,
        regex,
        entity,
        field
    })

    newSetting.id = newSetting._id

    return new Promise((resolve, rejects) => {
        newSetting.save((error => {

            if (error) {
                if (error.name == "ValidationError") {
                    return rejects(new UserInputError(error.message, {inputErrors: error.errors}));
                }
                return rejects(error)
            }

            resolve(newSetting)
        }))
    })
}


export const createSettings = async function (authUser, {key, entityText, entityValue, value, label, type, group, options, regex, entity, field}) {

    const docValue = value ? value.toString() : null

    const doc = new Settings({
        key,
        entityText,
        entityValue,
        value: docValue,
        label,
        group: group ? group : 'General',
        type,
        options,
        regex,
        entity,
        field
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

export const updateSettings = async function (authUser, id, {key, entityText, entityValue, value, label, type, options, regex}) {

    const docValue = value ? value.toString() : null

    return new Promise((resolve, rejects) => {
        Settings.findOneAndUpdate({_id: id},
            {
                key,
                entityText,
                entityValue,
                value: docValue,
                label,
                ...(type ? {type} : {}),
                ...(options ? {options} : {}),
                regex
            },
            {new: true, runValidators: true, context: 'query'},
            (error, doc) => {

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

export const updateSettingsByKey = async function (authUser, {key,  value, valueList = []}) {
    return new Promise((resolve, rejects) => {

        const docValue = (value || typeof value === 'boolean') ? value.toString() : null
        const docValueList = valueList ? valueList.map(i => i.toString()) : []

        Settings.findOneAndUpdate({key: key},
            {
                value: docValue,
                valueList: docValueList
            },
            {new: true, runValidators: true, context: 'query'},
            (error, doc) => {

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

export async function fetchEntityOptions(key){
    const setting = await findSettingsByKey(key)
    const {entity, entityValue, entityText} = setting
    const documentsFromCollection = await mongoose.connection.db.collection(entity).find({},{[entityValue]:1,[entityText]:1}).toArray()
    const values = documentsFromCollection.map(document => ({entityValue: document[entityValue], entityText: document[entityText]}))
    return values
}

//Settings Group Services

export const fetchSettingsGroup = async() => {
    let settingGroup =  await Settings.aggregate([
        {
            $group: {
                _id: {group: "$group"},
                settings: {$push: "$$ROOT"}
                }
        },
        {
            $project:{
                _id: 1,
                group: "$_id.group",
                settings: 1
            }
        },
        {
            $sort: {group: 1}
        }
    ])
   // console.log("settingGroup", JSON.stringify(settingGroup, null, 4))

    return settingGroup
}
