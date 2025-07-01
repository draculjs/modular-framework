import { updateUserUsedStorage, findUserStorageByUser } from './UserStorageService'
import { FILE_SHOW_ALL, FILE_SHOW_OWN } from '../permissions/File'
import { DefaultLogger as winston } from '@dracul/logger-backend'
import { GroupService } from '@dracul/user-backend'
import { storeFile } from '@dracul/common-backend'
import File from '../models/FileModel'
import FileDTO from '../DTOs/FileDTO'
import dayjs from 'dayjs'
import fs from 'fs'

const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

class FileService {

    async findFile(id, userId = null, allFilesAllowed, ownFilesAllowed, publicAllowed) {
        try {
            if (!id) throw new Error('id field is required')
            const userGroups = await GroupService.fetchMyGroups(userId)
            const file = await File.findOne({
                _id: id,
                ...this._filterByPermissions(userId, allFilesAllowed, ownFilesAllowed, publicAllowed, userGroups)
            }).populate('createdBy.user')

            return file
        } catch (error) {
            winston.error(`FileService.findFile error: ${error}`)
            throw error
        }
    }

    async fetchFiles(expirationDate = null) {
        const query = this._buildExpirationFilter(expirationDate)
        return await File.find(query).populate('createdBy.user')
    }

    async paginateFiles(
        { pageNumber = 1, itemsPerPage = 5, search = null, filters, orderBy = null, orderDesc = false },
        userId = null,
        allFilesAllowed = false,
        ownFilesAllowed = false,
        publicAllowed = false,
        hideSensitiveData = false
    ) {
        const userGroups = await GroupService.fetchMyGroups(userId)
        const query = {
            ...this._buildSearchQuery(search),
            ...this._buildFilterQuery(filters),
            ...this._filterByPermissions(userId, allFilesAllowed, ownFilesAllowed, publicAllowed, userGroups)
        }

        const populate = ['createdBy.user.username']
        const sort = this._getSortOption(orderBy, orderDesc)
        const params = { page: pageNumber, limit: itemsPerPage, populate, sort }

        const filePaginationResult = await File.paginate(query, params)
        const filePaginationObject = {
            items: filePaginationResult.docs,
            totalItems: filePaginationResult.totalDocs,
            page: filePaginationResult.page
        }

        return hideSensitiveData ? this._applySensitiveDataFilter(filePaginationObject) : filePaginationObject
    }

    async updateFile(authUser, newFile, { id, description, tags, expirationDate, isPublic, groups, users }, userId, allFilesAllowed, ownFilesAllowed, publicAllowed) {
        const updatedFile = await this._updateFileDocument(
            id, 
            { description, tags, expirationDate, isPublic, groups, users }, 
            userId,
            allFilesAllowed,
            ownFilesAllowed,
            publicAllowed
        )

        if (newFile) await this._replaceFileContent(updatedFile, newFile, userId, authUser.username)
        return updatedFile
    }

    async updateFileRest(id, user, permissionType, newFile) {
        try {
            const fileDocument = await this._getFileForUpdate(id, user, permissionType)
            if (fileDocument) await this._replaceFileContent(fileDocument, newFile, user.id, user.username)
            return true
        } catch (error) {
            winston.error(`FileService.updateFileRest error: ${error}`)
            return false
        }
    }

    async updateFileMetadata(id, user, permissionType, { description, expirationDate, tags, isPublic }) {
        if (!description && !expirationDate && !tags && !isPublic) {
            throw new Error("File fields to update were not provided")
        }

        const userProvidedDate = expirationDate ? dayjs(expirationDate, 'DD/MM/YYYY') : null
        if (userProvidedDate && !userProvidedDate.isValid()) {
            throw new Error('Invalid date format')
        }

        const userStorage = await findUserStorageByUser(user)
        const formattedExpirationDate = userProvidedDate ? userProvidedDate.format('YYYY/MM/DD') : null
        const timeDiffExpirationDate = this._validateExpirationDate(formattedExpirationDate)

        if (timeDiffExpirationDate > userStorage.fileExpirationTime) {
            throw new Error(`File expiration exceeds maximum of ${userStorage.fileExpirationTime} days`)
        }

        const updatedFile = await File.findOneAndUpdate(
            { _id: id, ...this._getPermissionFilter(permissionType, user.id) },
            { $set: { description, expirationDate: formattedExpirationDate, tags, isPublic } },
            { new: true }
        )

        if (!updatedFile) throw new Error(`File not found with id ${id}`)
        return updatedFile
    }

    async updateByRelativePath(relativePath) {
        try {
            return await File.findOneAndUpdate(
                { relativePath: relativePath },
                { lastAccess: Date.now(), '$inc': { hits: 1 } },
                { runValidators: true, context: 'query', new: true }
            )
        } catch (error) {
            winston.error(`FileService.updateByRelativePath error: ${error}`)
            throw error
        }
    }

    async deleteFile(id, userId, allFilesAllowed, ownFilesAllowed, publicAllowed) {
        try {
            const file = await this.findFile(id, userId, allFilesAllowed, ownFilesAllowed, publicAllowed)
            if (!file) throw new Error('File not found')

            await fs.promises.unlink(file.relativePath)
            await File.deleteOne({ _id: id })
            await updateUserUsedStorage(userId, -file.size)

            winston.info(`Deleted file: ${file.relativePath}`)
            return { id: id, success: true }
        } catch (error) {
            winston.error(`FileService.deleteFile error: ${error}`)
            throw error
        }
    }

    async findAndDeleteExpiredFiles() {
        try {
            const docs = await File.aggregate([
                { $match: { expirationDate: { $eq: null } }},
                {
                    $lookup: {
                        from: "userstorages",
                        localField: "createdBy.user",
                        foreignField: "user",
                        as: "userStorage",
                    }
                },
                { $unwind: "$userStorage" },
                {
                    $addFields: {
                        timeDiffInMillis: {
                            $cond: [
                                { $eq: ["$userStorage.deleteByLastAccess", true] },
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
                    $match: {
                        $expr: { $lte: ["$userStorage.fileExpirationTime", "$timeDiffInDays"] }
                    }
                }
            ])

            return this._deleteFilesBatch(docs)
        } catch (error) {
            winston.error(`FileService.findAndDeleteExpiredFiles error: ${error}`)
            throw error
        }
    }

    async findAndDeleteByExpirationDate() {
        const expirationDate = new Date()
        const docs = await this.fetchFiles(expirationDate)
        return this._deleteFilesBatch(docs)
    }


    // Private methods


    _filterByPermissions(userId, allFilesAllowed, ownFilesAllowed, publicAllowed, userGroups = []) {
        if (allFilesAllowed) return {}

        if (ownFilesAllowed && publicAllowed) {
            return { $or: [
                { 'createdBy.user': userId }, 
                { 'isPublic': true }, 
                { 'groups': { $in: userGroups } }, 
                { 'users': { $in: [userId] } }
            ]}
        } 
        
        if (ownFilesAllowed) {
            return { $or: [
                { 'createdBy.user': userId }, 
                { 'groups': { $in: userGroups } }, 
                { 'users': { $in: [userId] } }
            ]}
        } 
        
        if (publicAllowed) {
            return { $or: [
                { 'isPublic': true }, 
                { 'groups': { $in: userGroups } }, 
                { 'users': { $in: [userId] } }
            ]}
        } 
        
        throw new Error("User doesn't have permissions for reading files")
    }

    _buildExpirationFilter(expirationDate) {
        if (!expirationDate) return {}

        const start = new Date(expirationDate)
        start.setHours(0, 0, 0)

        const end = new Date(expirationDate)
        end.setHours(23, 59, 59)

        return { $and: [{ createdAt: { $gte: start } }, { createdAt: { $lte: end } }] }
    }

    _buildSearchQuery(search) {
        return search ? { filename: { $regex: search, $options: 'i' } } : {}
    }

    _buildFilterQuery(filters) {
        if (!filters) return {}

        return filters.reduce((query, { field, operator, value }) => {
            if (!value) return query

            switch (field) {
                case 'dateFrom':
                    return { 
                        ...query, 
                        createdAt: { 
                            ...query.createdAt, 
                            [operator]: new Date(value) 
                        } 
                    }
                case 'dateTo':
                    return { 
                        ...query, 
                        createdAt: { 
                            ...query.createdAt, 
                            [operator]: dayjs(value).add(1, 'day').toDate() 
                        } 
                    }
                case 'filename':
                    return { ...query, filename: { [operator]: value, $options: "i" } }
                case 'createdBy.user':
                    return { ...query, 'createdBy.user': { [operator]: value } }
                case 'type':
                    return { ...query, type: { [operator]: value, $options: "i" } }
                case 'minSize':
                    return { ...query, size: { [operator]: parseFloat(value) } }
                case 'maxSize':
                    return { ...query, size: { ...query.size, [operator]: parseFloat(value) } }
                case 'isPublic':
                    return { ...query, isPublic: { [operator]: value } }
                case 'groups':
                    return { ...query, groups: { [operator]: value } }
                case 'users':
                    return { ...query, users: { [operator]: value } }
                default:
                    return query
            }
        }, {})
    }

    _getSortOption(orderBy, orderDesc) {
        return orderBy ? (orderDesc ? '-' : '') + orderBy : null
    }

    _applySensitiveDataFilter(paginationResult) {
        return {...paginationResult, items: paginationResult.items.map(item => new FileDTO(item))}
    }

    async _updateFileDocument(id, updateData, userId, allFilesAllowed, ownFilesAllowed, publicAllowed) {
        const userGroups = await GroupService.fetchMyGroups(userId)
        
        return await File.findOneAndUpdate(
            { _id: id, ...this._filterByPermissions(userId, allFilesAllowed, ownFilesAllowed, publicAllowed, userGroups)},
            updateData, { new: true, runValidators: true }
        ).populate('createdBy.user.username')
    }

    async _replaceFileContent(file, newFile, userId, username) {
        const newExtension = '.' + (await newFile).filename.split('.').pop()
        if (file.extension !== newExtension) throw new Error('File extension mismatch during update')

        await storeFile((await newFile).createReadStream(), file.relativePath)

        file.fileReplaces.push({ 
            user: userId, 
            date: dayjs(), 
            username 
        })
        
        await file.save()
    }

    async _getFileForUpdate(id, user, permissionType) {
        const showAll = permissionType === FILE_SHOW_ALL
        const showOwn = permissionType === FILE_SHOW_OWN
        
        return await File.findOne({ _id: id, ...this._filterByPermissions(user, showAll, showOwn, false) })
        .populate('createdBy.user.username')
    }

    _getPermissionFilter(permissionType, userId) {
        return permissionType === FILE_SHOW_ALL ? {} : { 'createdBy.user': userId }
    }

    async _deleteFilesBatch(files) {
        if (!files || !files.length) return

        const deletePromises = files.map(async file => {
            try {
                await fs.promises.unlink(file.relativePath)
                await updateUserUsedStorage(file.createdBy.user, -file.size)
            } catch (error) {
                winston.error(`Error deleting file ${file.relativePath}: ${error}`)
            }
        })

        await Promise.all(deletePromises)
        const fileIds = files.map(file => file._id)
        return await File.deleteMany({ _id: { $in: fileIds } })
    }

    _validateExpirationDate(expirationTime) {
        if (!expirationTime) return 0
        
        const today = new Date()
        const expirationDate = new Date(expirationTime)
        
        if (expirationDate > today) return (expirationDate - today) / (1000 * 3600 * 24)

        return 0
    }
}

export default new FileService()