import Settings from '../models/SettingsModel'
import {mongoose} from '@dracul/common-backend'
import {UserInputError} from 'apollo-server-errors'
import Settings from '../models/SettingsModel'
import {mongoose} from '@dracul/common-backend'
import {UserInputError} from 'apollo-server-errors'

export const initializeSettings = async function (settings = []) {

    if (!Array.isArray(settings)) {
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

    if (!(setting instanceof Object)) throw new Error('Setting must be an Object')
    if (!setting.key) throw new Error('Setting must have a key')
    if (!setting.label) throw new Error('Setting must have a label')

    let settingDoc = await createOrUpdateSettings(null, setting)

    return settingDoc
}


export const findSettings = async function (id) {

    try {
        const settings = await Settings.findOne({_id: id}).exec()
        return settings
    } catch (e) {
        throw e
    }
}

export const findSettingsByKey = async function (key) {
    try {
        const settings = await Settings.findOne({key: key}).exec()
        return settings
    } catch (e) {
        throw e
    }
}

export const getSettingsValueByKey = async function (key) {

    try {
        const settings = await Settings.findOne({key: key}).exec()
        if (settings) {
            switch (settings.type) {
                case 'stringList':
                case 'enumList':
                    return settings.valueList
                case 'numberList':
                    return settings.valueList.map(v => parseFloat(v))
                case 'number':
                    return parseFloat(settings.value)
                case 'boolean':
                    return settings.value === "enable"
                default:
                    return settings.value
            }
        }
        return null
    } catch (e) {
        throw e
    }

}

export const findSettingsByKeys = async function (keys = []) {

    try {
        const settingDocs = await Settings.find({key: {$in: keys}}).exec()
        let settings = {}
        settingDocs.forEach(doc => {
            settings[doc.key] = doc
        })
        return settings
    } catch (e) {
        throw e
    }

}

export const fetchSettings = async function () {
    try {
        const settings = await Settings.find({}).exec()
        return settings
    } catch (e) {
        throw e
    }
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

export const createOrUpdateSettings = async (authUser, {
    key,
    entityText,
    entityValue,
    value,
    valueList,
    label,
    type,
    group,
    options,
    regex,
    entity,
    field,
    prefix,
    suffix
}) => {

    try {
        const setting = await Settings.findOne({key})

        if (setting) {
            setting.entityText = entityText
            setting.entityValue = entityValue
            setting.label = label
            setting.group = group
            setting.type = type
            setting.options = options
            setting.regex = regex
            setting.entity = entity
            setting.field = field
            setting.prefix = prefix
            setting.suffix = suffix

            return new Promise(async (resolve, rejects) => {
                try {
                    await setting.save()
                    resolve(setting)
                } catch (error) {
                    if (error) {
                        if (error.name == "ValidationError") {
                            return rejects(new UserInputError(error.message, {inputErrors: error.errors}));
                        }
                        return rejects(error)
                    }
                }

            })
        }

        let docValue = null
        if (typeof value === 'boolean') {
            docValue = value ? "enable" : "disable"
        } else if (value || value === 0) {
            docValue = value.toString()
        }

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
            field,
            prefix,
            suffix
        })

        newSetting.id = newSetting._id

        await newSetting.save()
        return newSetting

    } catch (error) {
        if (error.name == "ValidationError") {
            throw new UserInputError(error.message, {inputErrors: error.errors})
        }
        throw error
    }


}


export const createSettings = async function (authUser, {
    key,
    entityText,
    entityValue,
    value,
    label,
    type,
    group,
    options,
    regex,
    entity,
    field,
    prefix,
    suffix
}) {

    try {
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
            field, prefix, suffix
        })

        doc.id = doc._id;
        await doc.save()
        return doc

    } catch (error) {
        if (error.name == "ValidationError") {
            throw new UserInputError(error.message, {inputErrors: error.errors})
        }
        throw error
    }

}

export const updateSettings = async function (authUser, id, {
    key,
    entityText,
    entityValue,
    value,
    label,
    type,
    options,
    regex,
    prefix,
    suffix
}) {

    try{
        const docValue = (value || typeof value === 'boolean' || value === 0) ? value.toString() : null

        const settings = await Settings.findOneAndUpdate({_id: id},
            {
                key,
                entityText,
                entityValue,
                value: docValue,
                label,
                ...(type ? {type} : {}),
                ...(options ? {options} : {}),
                regex, prefix, suffix
            },
            {new: true, runValidators: true, context: 'query'}).exec()
        return settings
    }catch (error) {
        if (error.name == "ValidationError") {
            throw new UserInputError(error.message, {inputErrors: error.errors})
        }
        throw error
    }
}

export const updateSettingsByKey = async function (authUser, {key, value, valueList = []}) {

    try{
        let docValue = null

        if (typeof value === 'boolean') {
            docValue = value ? "enable" : "disable"
        } else if (value || value === 0) {
            docValue = value.toString()
        }

        const docValueList = valueList ? valueList.map(i => i.toString()) : []

        const settings = await Settings.findOneAndUpdate({key: key},
            {
                value: docValue,
                valueList: docValueList
            },
            {new: true, runValidators: true, context: 'query'}).exec()

        return settings
    }catch (error) {
        if (error.name == "ValidationError") {
            throw new UserInputError(error.message, {inputErrors: error.errors})
        }
        throw error
    }
}

export const deleteSettings = async function (id) {
    try{
        const setting = await findSettings(id)
        await setting.delete()
    }catch (e) {
        throw e
    }
}

export async function fetchEntityOptions(key) {
    const setting = await findSettingsByKey(key)
    const {entity, entityValue, entityText} = setting
    const documentsFromCollection = await mongoose.connection.db.collection(entity).find({}, {
        [entityValue]: 1,
        [entityText]: 1
    }).toArray()
    const values = documentsFromCollection.map(document => ({
        entityValue: document[entityValue],
        entityText: document[entityText]
    }))
    return values
}

//Settings Group Services

export const fetchSettingsGroup = async () => {
    let settingGroup = await Settings.aggregate([
        {
            $group: {
                _id: {group: "$group"},
                settings: {$push: "$$ROOT"}
            }
        },
        {
            $project: {
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
