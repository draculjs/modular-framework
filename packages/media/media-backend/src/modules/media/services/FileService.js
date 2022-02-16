import File from './../models/FileModel'
import { UserInputError } from 'apollo-server-express'
import { FILE_SHOW_OWN, FILE_UPDATE_OWN, FILE_DELETE_OWN } from "../../media/permissions/File";
import dayjs from 'dayjs'
import { updateUserUsedStorage, findUserStorageByUser } from './UserStorageService';
import fs from 'fs';
import { DefaultLogger as winston } from '@dracul/logger-backend';

export const findFile = async function (id, permissionType = null, userId = null) {

    if (id) {
        return new Promise((resolve, reject) => {
            File.findOne({ _id: id, ...filterByFileOwner(permissionType, userId) }).populate('createdBy.user').exec((err, res) => (
                err ? reject(err) : resolve(res)
            ));
        })
    } else {
        throw new Error({ message: 'id field is required' })
    }
}

export const fetchFiles = async function () {
    return new Promise((resolve, reject) => {
        File.find({}).populate('createdBy.user').exec((err, res) => (
            err ? reject(err) : resolve(res)
        ));
    })
}


export const paginateFiles = function ({ pageNumber = 1, itemsPerPage = 5, search = null, filters, orderBy = null, orderDesc = false }, permissionType = null, userId = null) {

    function qs(search) {
        let qs = {}
        if (search) {
            qs = {
                $or: [
                    { filename: { $regex: search, $options: 'i' } },
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

    function filterValues(filters) {
        let qsFilter = {};

        if (filters) {
            filters.forEach(({ field, operator, value }) => {
                switch (field) {
                    case 'dateFrom':
                        if (value) {
                            let dayBefore = dayjs(value).isValid() && dayjs(value)
                            qsFilter.createdAt = { [operator]: dayBefore.$d }
                        }
                        break
                    case 'dateTo':
                        if (value) {
                            let dayAfter = dayjs(value).isValid() && dayjs(value)
                            if (qsFilter.createdAt) {
                                qsFilter.createdAt = { ...qsFilter.createdAt, [operator]: dayAfter.$d }
                            } else {
                                qsFilter.createdAt = { [operator]: dayAfter.$d }
                            }
                        }
                        break
                    case 'filename':
                        (value) && (qsFilter.filename = { [operator]: value, $options: "i" })
                        break
                    case 'createdBy.user':
                        (value) && (qsFilter["createdBy.user"] = { [operator]: value })
                        break
                    case 'type':
                        (value) && (qsFilter.type = { [operator]: value, $options: "i" })
                        break
                    case 'minSize':
                        value && (qsFilter.size = { [operator]: parseFloat(value) })
                        break
                    case 'maxSize':
                        if (value) {
                            if (qsFilter.size) {
                                qsFilter.size = { ...qsFilter.size, [operator]: parseFloat(value) }
                            } else {
                                qsFilter.size = { [operator]: parseFloat(value) }
                            }
                        }
                        break
                    default:
                        break;
                }
            })
            return qsFilter;
        }

    }

    let query = {
        ...qs(search),
        ...filterByFileOwner(permissionType, userId),
        ...filterValues(filters)
    }

    let populate = ['createdBy.user']
    let sort = getSort(orderBy, orderDesc)
    let params = { page: pageNumber, limit: itemsPerPage, populate, sort }

    return new Promise((resolve, reject) => {
        File.paginate(query, params).then(result => {
            resolve({ items: result.docs, totalItems: result.totalDocs, page: result.page })
        }
        ).catch(err => reject(err))
    })
}


export const updateFile = async function (authUser, id, input, permissionType, userId) {
    return new Promise((resolve, rejects) => {
        File.findOneAndUpdate({ _id: id, ...filterByFileOwner(permissionType, userId) },
            { description, tags, expirationDate },
            { new: true, runValidators: true, context: 'query' },
            (error, doc) => {
                if (error) {
                    if (error.name == "ValidationError") {
                        rejects(new UserInputError(error.message, { inputErrors: error.errors }));
                    }
                    rejects(error)
                }
                if (doc) {
                    doc.populate('createdBy.user').execPopulate(() => resolve(doc))
                } else {
                    rejects('File not found')
                }
            })
    })
}

// Rest service
export const updateFileRest = function (id, user, permissionType, input) {
    return new Promise(async (resolve, reject) => {

        let updatedFile = purgeInput(input);

        if (!input || Object.entries(input).length == 0) {
            throw reject({ message: "File content can not be empty", status: 400 })
        }

        let userStorage = await findUserStorageByUser(user)

        let timeDiffExpirationDate = validateExpirationDate(input.expirationDate)
        console.log(timeDiffExpirationDate)
        if (timeDiffExpirationDate > userStorage.fileExpirationTime) {
            throw reject({
                message: `File expiration can not be longer than max user expiration time per file (${userStorage.fileExpirationTime} days)`,
                status: 403
            })
        }

        // Find file and update it with the request body
        File.findOneAndUpdate({ _id: id, ...filterByFileOwner(permissionType, user.id) },
            { $set: updatedFile },
            { new: true })
            .then(file => {
                if (!file) {
                    throw reject({ message: `file not found with id ${id}`, status: 404 })
                }
                resolve(file);
            }).catch(err => {
                if (err.kind === 'ObjectId') {
                    throw reject({ message: `file not found with id ${id}`, status: 404 })
                }
                throw reject({ message: `Error updating file with id ${id}. Error: ${err}`, status: 500 })
            });
    });
}

export const updateByRelativePath = function (relativePath) {

    return new Promise((resolve, rejects) => {
        File.findOneAndUpdate({ relativePath: relativePath },
            { lastAccess: Date.now() },
            { runValidators: true, context: 'query' },
            (error, doc) => {
                if (error) {
                    rejects(error)
                }
                if (doc) {
                    resolve(doc)
                } else {
                    rejects('File not found')
                }
            })
    })
}

export const deleteFile = function (id, permissionType, userId) {

    return new Promise((resolve, rejects) => {
        findFile(id, permissionType, userId).then(async (doc) => {
            if (doc) {
                try {
                    updateUserUsedStorage(userId, -doc.size)
                    fs.unlink(doc.relativePath, (error) => {
                        if (error) winston.error(error)
                        else winston.info('Se eliminó el archivo ' + doc.relativePath)
                    });
                    await File.deleteOne({ _id: id });
                    resolve({ id: id, success: true })
                } catch (err) {
                    rejects(err)
                }
            } else {
                rejects('File not found')
            }
        })
    })
}

export const findAndDeleteExpiredFiles = async function () {

    function getDataEntity() {

        return [
            {
                $lookup: {
                    from: "userstorages",
                    localField: "createdBy.user",
                    foreignField: "user",
                    as: "userStorage",
                },
            },
            {
                $unwind: "$userStorage",
            },
            {
                $addFields: {
                    timeDiffInMillis: {
                        $cond: [
                            {
                                $eq: ["$userStorage.deleteByLastAccess", true]
                            },
                            { $subtract: ["$$NOW", "$lastAccess"] },
                            { $subtract: ["$$NOW", "$createdAt"] }
                        ]
                    }
                }
            },
            {
                $addFields: {
                    timeDiffInDays: { $divide: ["$timeDiffInMillis", 24 * 60 * 60 * 1000] }
                }
            },
            {
                $addFields: {
                    roundedTime: { $round: ["$timeDiffInDays", 0] }
                }
            },
            {
                $match: {
                    $expr: { $lte: ["$userStorage.fileExpirationTime", "$roundedTime"] },
                },
            }
        ];
    }

    const entityData = getDataEntity();
    const aggregateData = [entityData];
    let docs = []

    await File.aggregate(aggregateData).then((result) => {
        docs = result;
    }).catch((error) => {
        winston.error('FileService - findExpiredFiles - Error en aggregate: ' + error)
    });

    // For each de los files con unlink y actualizo usedSpace de userStorage
    if (docs) {
        docs.forEach((file) => {
            updateUserUsedStorage(file.createdBy.user, -file.size)
            fs.unlink(file.relativePath, (error) => {
                if (error) winston.error('FileService - findExpiredFiles. No se borró el archivo ' + file.relativePath + ':' + error)
                else winston.info('Se eliminó el archivo ' + file.relativePath)
            });
        })
    }

    // Mappeo los ids de los files encontrados
    let fileIds = docs.map(file => { return file._id });

    // Borro los files encontrados
    return new Promise((resolve, reject) => {
        File.deleteMany({ _id: { $in: fileIds } }).then((result) => {
            resolve({ ok: result.ok, deletedCount: result.deletedCount })
        }).catch((err) => {
            winston.error('FileService - findExpiredFiles. Error en deleteMany: ' + error)
            reject({ ok: err.ok, deletedCount: err.deletedCount })
        })
    });
}

function filterByFileOwner(permissionType, userId) {
    let query;
    switch (permissionType) {
        // Si el user es dueño del archivo (o es admin), puede encontrarlo, actualizarlo o borrarlo
        case FILE_SHOW_OWN:
        case FILE_UPDATE_OWN:
        case FILE_DELETE_OWN:
            query = { 'createdBy.user': userId }
            break;
        default:
            break;
    }
    return query;
}

function validateExpirationDate(expirationTime) {
    const today = new Date();
    const expirationDate = new Date(expirationTime);
    if (expirationDate > today) {
        return ((expirationDate - today) / (1000 * 3600 * 24)).toFixed(2);
    }
    return null;
}

function purgeInput(input) {
    let updatedFile = {};
    for (const key in input) {
        if (key == 'description' || key == 'expirationDate' || key == 'tags') {
            updatedFile[key] = input[key];
        }
    }
    return updatedFile;
}