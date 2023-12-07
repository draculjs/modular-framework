import { updateUserUsedStorage, findUserStorageByUser } from './UserStorageService';
import File from '../models/FileModel';
import FileDTO from '../DTOs/FileDTO';

import { DefaultLogger as winston } from '@dracul/logger-backend';
import { GroupService } from '@dracul/user-backend';
import { storeFile } from '@dracul/common-backend';

import { UserInputError } from 'apollo-server-express';
import dayjs from 'dayjs'
import fs from 'fs';

const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)


export const findFile = async function (id, userId = null, allFilesAllowed, ownFilesAllowed, publicAllowed) {
    try {
        if (!id) throw new Error({ message: 'id field is required' })
        const userGroups = await GroupService.fetchMyGroups(userId)
        const file = await File.findOne({
            _id: id, ...filterByPermissions(userId, allFilesAllowed, ownFilesAllowed, publicAllowed, userGroups)
        }).populate('createdBy.user').exec()

        return file
    } catch (error) {
        winston.error(`An error happened at the findFile service: '${error}'`)
        throw error
    }
}

export const fetchFiles = async function (expirationDate = null) {

    function filter(expirationDate) {

        let operationsRange = {};
        let dateSinceForQuery = null
        let dateUntilForQuery = null

        if (expirationDate) {

            dateSinceForQuery = new Date(expirationDate);
            dateSinceForQuery.setHours(0);
            dateSinceForQuery.setMinutes(0);

            dateUntilForQuery = new Date(expirationDate);
            dateUntilForQuery.setHours(23);
            dateUntilForQuery.setMinutes(59);

            operationsRange = {
                $and: [
                    { createdAt: { $gte: dateSinceForQuery } },
                    { createdAt: { $lte: dateUntilForQuery } },
                ],
            };

        }
        return operationsRange;
    }

    const query = filter(expirationDate);

    return new Promise((resolve, reject) => {
        File.find(query).populate('createdBy.user').exec((err, res) => (
            err ? reject(err) : resolve(res)
        ));
    })
}

function filterByPermissions(userId, allFilesAllowed, ownFilesAllowed, publicAllowed, userGroups = []) {
    let q = {};

    if (allFilesAllowed) return q

    if (ownFilesAllowed && publicAllowed) {
        q = { $or: [{ 'createdBy.user': userId }, { 'isPublic': true }, { 'groups': { $in: userGroups } }, { 'users': { $in: [userId] } }] }
    } else if (ownFilesAllowed) {
        q = { $or: [{ 'createdBy.user': userId }, { 'groups': { $in: userGroups } }, { 'users': { $in: [userId] } }] }
    } else if (publicAllowed) {
        q = { $or: [{ 'isPublic': true }, { 'groups': { $in: userGroups } }, { 'users': { $in: [userId] } }] }
    } else {
        throw new Error("User doesn't have permissions for reading files")
    }

    return q;
}

export const paginateFiles = async function (
    { pageNumber = 1, itemsPerPage = 5, search = null, filters, orderBy = null, orderDesc = false },
    userId = null,
    allFilesAllowed = false,
    ownFilesAllowed = false,
    publicAllowed = false,
    hideSensitiveData = false

) {

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
                            let dayAfter = dayjs(value).isValid() && dayjs(value).add(1, 'day')
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
                    case 'isPublic':
                        value && (qsFilter.isPublic = { [operator]: value })
                        break
                    case 'groups':
                        value && (qsFilter.groups = { [operator]: value })
                        break
                    case 'users':
                        value && (qsFilter.users = { [operator]: value })
                        break
                    default:
                        break;
                }
            })
            return qsFilter;
        }

    }

    function hideSensitiveDataFromPaginatedFiles(filePaginationObject) {
        for (let index = 0; index < filePaginationObject.items.length; index++) {
            filePaginationObject.items[index] = new FileDTO(filePaginationObject.items[index])
        }

        return filePaginationObject
    }

    const userGroups = await GroupService.fetchMyGroups(userId)
    const query = {
        ...qs(search),
        ...filterValues(filters),
        ...filterByPermissions(userId, allFilesAllowed, ownFilesAllowed, publicAllowed, userGroups)
    }

    const populate = ['createdBy.user']
    const sort = getSort(orderBy, orderDesc)
    const params = { page: pageNumber, limit: itemsPerPage, populate, sort }

    const filePaginationResult = await File.paginate(query, params)
    const filePaginationObject = { items: filePaginationResult.docs, totalItems: filePaginationResult.totalDocs, page: filePaginationResult.page }

    return (hideSensitiveData) ? hideSensitiveDataFromPaginatedFiles(filePaginationObject) : filePaginationObject
}


export const updateFile = async function (authUser, newFile, { id, description, tags, expirationDate, isPublic, groups, users }, userId, allFilesAllowed, ownFilesAllowed, publicAllowed) {

    async function updateDocFile() {
        const userGroups = await GroupService.fetchMyGroups(userId)

        try {
            const fileUpdateResult = await File.findOneAndUpdate(
                { _id: id, ...filterByPermissions(userId, allFilesAllowed, ownFilesAllowed, publicAllowed, userGroups) },
                { description, tags, expirationDate, isPublic, groups, users },
                { new: true, runValidators: true, context: 'query' }
            )

            await fileUpdateResult.populate('createdBy.user').execPopulate()
            return fileUpdateResult

        } catch (error) {
            if (error.name == "ValidationError") throw (new UserInputError(error.message, { inputErrors: error.errors }))
            throw error
        }
    }

    async function updateFileWithNewOne(fileToUpdate, newFile) {
        const newFileExtension = '.' + (await newFile).filename.split('.').pop()
        if (fileToUpdate.extension !== newFileExtension) throw new Error('The file update could not be made: the file extensions differ')

        const relativePath = fileToUpdate.relativePath
        const { createReadStream } = await newFile

        await storeFile(createReadStream(), relativePath)

        fileToUpdate.fileReplaces.push({ user: userId, date: dayjs(), username: authUser.username })
        fileToUpdate.save()

        console.log(`updateFileWithNewOne done at path '${relativePath}': '${fileToUpdate.fileReplaces[fileToUpdate.fileReplaces.length - 1]}'`)
    }

    const fileToUpdate = await updateDocFile()
    if (newFile) await updateFileWithNewOne(fileToUpdate, newFile)

    return fileToUpdate
}

// Rest service
export const updateFileRest = async function (id, user, permissionType, { description, expirationDate, tags, isPublic }) {
    try {
        if (!description && !expirationDate && !tags && !isPublic) throw new Error("File fields to update were not provided")

        const userProvidedDate = expirationDate ? dayjs(expirationDate, 'DD/MM/YYYY') : null
        if (userProvidedDate && !userProvidedDate.isValid()) throw new Error('Invalid date format')

        const userStorage = await findUserStorageByUser(user)

        const formattedExpirationDate = userProvidedDate ? userProvidedDate.format('YYYY/MM/DD') : null
        const timeDiffExpirationDate = validateExpirationDate(formattedExpirationDate)

        if (timeDiffExpirationDate > userStorage.fileExpirationTime) {
            throw new Error(`File expiration can not be longer than max user expiration time per file: (${userStorage.fileExpirationTime} days)`)
        }

        const updatedFile = await File.findOneAndUpdate(
            { _id: id, ...filterByPermissions(permissionType, user.id) },
            { $set: { description, expirationDate: formattedExpirationDate, tags, isPublic } },
            { new: true }
        )

        if (!updatedFile) throw new Error(`file not found with id ${id}`)
        return updatedFile
    } catch (error) {
        winston.error(`An error happened at the updateFileRest service: '${error}'`)
    }
}

export const updateByRelativePath = async function (relativePath) {
    try {
        return await File.findOneAndUpdate(
            { relativePath: relativePath },
            { lastAccess: Date.now(), '$inc': { hits: 1 } },
            { runValidators: true, context: 'query', new: true }
        )
    } catch (error) {
        console.log(`An error happened at updateByRelativePath: '${error}'`)
        throw error
    }
}

export async function deleteFile(id, userId, allFilesAllowed, ownFilesAllowed, publicAllowed) {
    try {
        const fileToDelete = await findFile(id, userId, allFilesAllowed, ownFilesAllowed, publicAllowed)
        if (!fileToDelete) throw new Error('File not found')

        await fs.promises.unlink(doc.relativePath)
        winston.info('Se eliminó el archivo ' + doc.relativePath)

        await File.deleteOne({ _id: id })
        await updateUserUsedStorage(userId, -doc.size)

        return ({ id: id, success: true })
    } catch (error) {
        winston.error(`An error happened at the deleteFile function: '${error}'`)
    }
}

export const findAndDeleteExpiredFiles = async function () {
    try {
        function getDataEntity() {
            return [
                {
                    $match: {
                        expirationDate: { $eq: null }
                    }
                },
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

        const entityData = getDataEntity()
        const aggregateData = [entityData]

        const docs = await File.aggregate(aggregateData)
        return deleteAndUnlinkFiles(docs)
    } catch (error) {
        winston.error(`An error happened at the findAndDeleteExpiredFiles function: '${error}'`)
        throw error
    }
}

export async function findAndDeleteByExpirationDate() {
    const expirationDate = new Date()
    const docs = await fetchFiles(expirationDate)

    return deleteAndUnlinkFiles(docs)
}

async function deleteAndUnlinkFiles(docs) {
    if (!docs) throw new Error("You need to provide a non-empty docs parameter")
    unlinkFiles(docs)

    // Mappeo los ids de los files encontrados
    const fileIds = docs.map(file => { return file._id })
    return deleteManyById(fileIds)
}

function unlinkFiles(files) {
    try {
        files.forEach(async function (file) {
            updateUserUsedStorage(file.createdBy.user, -file.size)
            await fs.promises.unlink(file.relativePath)
        })
    } catch (error) {
        winston.error(`An error happened at the unlinkFiles function: '${error}'`)
        throw error
    }
}

function deleteManyById(ids) {
    return new Promise((resolve, reject) => {
        File.deleteMany({ _id: { $in: ids } }).then((result) => {
            resolve({ ok: result.ok, deletedCount: result.deletedCount })
        }).catch((err) => {
            winston.error('FileService - findExpiredFiles. Error en deleteMany: ' + error)
            reject({ ok: err.ok, deletedCount: err.deletedCount })
        })
    });
}



function validateExpirationDate(expirationTime) {
    const today = new Date();
    const expirationDate = new Date(expirationTime);
    if (expirationDate > today) {
        return ((expirationDate - today) / (1000 * 3600 * 24)).toFixed(2);
    }
    return null;
}