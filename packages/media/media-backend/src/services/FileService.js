import { updateUserUsedStorage, findUserStorageByUser } from './UserStorageService.js'
import { FILE_SHOW_ALL, FILE_SHOW_OWN } from '../permissions/File.js'
import { DefaultLogger as winston } from '@dracul/logger-backend'
import { GroupService } from '@dracul/user-backend'
import { storeFile } from '@dracul/common-backend'
import File from '../models/FileModel.js'
import FileDTO from '../DTOs/FileDTO.js'
import dayjs from 'dayjs'
import fs from 'fs'

import customParseFormat from 'dayjs/plugin/customParseFormat.js'
dayjs.extend(customParseFormat)

export class FileService {

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
        try {
            const query = this._buildExpirationFilter(expirationDate)
            return await File.find(query).populate('createdBy.user')
        } catch (error) {
            winston.error(`FileService.fetchFiles error: ${error}`)
            throw error
        }
    }

    async paginateFiles(
        { pageNumber = 1, itemsPerPage = 5, search = null, filters, orderBy = null, orderDesc = false },
        userId = null,
        allFilesAllowed = false,
        ownFilesAllowed = false,
        publicAllowed = false,
        hideSensitiveData = false
    ) {
        try {
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
        } catch (error) {
            winston.error(`FileService.paginateFiles error: ${error}`)
            throw error
        }
    }

    async updateFile(authUser, newFile, { id, description, tags, expirationDate, isPublic, groups, users }, userId, allFilesAllowed, ownFilesAllowed, publicAllowed) {
        try {
            const updatedFile = await this._updateFileDocument(
                id, 
                { description, tags, expirationDate, isPublic, groups, users }, 
                userId,
                allFilesAllowed,
                ownFilesAllowed,
                publicAllowed
            )

            if (newFile) {
                await this._replaceFileContent(updatedFile, newFile, userId, authUser.username)
            }

            return updatedFile
        } catch (error) {
            winston.error(`FileService.updateFile error: ${error}`)
            throw error
        }
    }

    async updateFileRest(id, user, permissionType, newFile) {
        try {
            const fileDocument = await this._getFileForUpdate(id, user, permissionType)
            if (fileDocument) {
                await this._replaceFileContent(fileDocument, newFile, user.id, user.username)
            }
        } catch (error) {
            winston.error(`FileService.updateFileRest error: ${error}`)
            throw error
        }
    }

    async updateFileMetadata(id, user, permissionType, { description, expirationDate, tags, isPublic }) {
        try {
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
        } catch (error) {
            winston.error(`FileService.updateFileMetadata error: ${error}`)
            throw error
        }
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
        try {
            const expirationDate = new Date()
            const docs = await this.fetchFiles(expirationDate)
            return this._deleteFilesBatch(docs)
        } catch (error) {
            winston.error(`FileService.findAndDeleteByExpirationDate error: ${error}`)
            throw error
        }
    }


    // Private methods


    _filterByPermissions(userId, allFilesAllowed, ownFilesAllowed, publicAllowed, userGroups = []) {
        try {
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
        } catch (error) {
            winston.error(`FileService._filterByPermissions error: ${error}`)
            throw error
        }
    }

    _buildExpirationFilter(expirationDate) {
        try {
            if (!expirationDate) return {}

            const start = new Date(expirationDate)
            start.setHours(0, 0, 0)

            const end = new Date(expirationDate)
            end.setHours(23, 59, 59)

            return { $and: [{ createdAt: { $gte: start } }, { createdAt: { $lte: end } }] }
        } catch (error) {
            winston.error(`FileService._buildExpirationFilter error: ${error}`)
            throw error
        }
    }

    _buildSearchQuery(search) {
        try {
            return search ? { filename: { $regex: search, $options: 'i' } } : {}
        } catch (error) {
            winston.error(`FileService._buildSearchQuery error: ${error}`)
            throw error
        }
    }

    _buildFilterQuery(filters) {
        try {
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
        } catch (error) {
            winston.error(`FileService._buildFilterQuery error: ${error}`)
            throw error
        }
    }

    _getSortOption(orderBy, orderDesc) {
        try {
            return orderBy ? (orderDesc ? '-' : '') + orderBy : null
        } catch (error) {
            winston.error(`FileService._getSortOption error: ${error}`)
            throw error
        }
    }

    _applySensitiveDataFilter(paginationResult) {
        try {
            return {...paginationResult, items: paginationResult.items.map(item => new FileDTO(item))}
        } catch (error) {
            winston.error(`FileService._applySensitiveDataFilter error: ${error}`)
            throw error
        }
    }

    async _updateFileDocument(id, updateData, userId, allFilesAllowed, ownFilesAllowed, publicAllowed) {
        try {
            const userGroups = await GroupService.fetchMyGroups(userId)
            
            return await File.findOneAndUpdate(
                { _id: id, ...this._filterByPermissions(userId, allFilesAllowed, ownFilesAllowed, publicAllowed, userGroups)},
                updateData, { new: true, runValidators: true }
            ).populate('createdBy.user.username')
        } catch (error) {
            winston.error(`FileService._updateFileDocument error: ${error}`)
            throw error
        }
    }

    async _replaceFileContent(file, newFile, userId, username) {
        try {
            const newExtension = '.' + (await newFile).filename.split('.').pop()
            if (file.extension !== newExtension) throw new Error('File extension mismatch during update')

            await storeFile((await newFile).createReadStream(), file.relativePath)

            file.fileReplaces.push({ 
                user: userId, 
                date: dayjs(), 
                username 
            })
            
            await file.save()
        } catch (error) {
            winston.error(`FileService._replaceFileContent error: ${error}`)
            throw error
        }
    }

    async _getFileForUpdate(id, user, permissionType) {
        try {
            const showAll = permissionType === FILE_SHOW_ALL
            const showOwn = permissionType === FILE_SHOW_OWN
            
            return await File.findOne({ _id: id, ...this._filterByPermissions(user, showAll, showOwn, false) })
            .populate('createdBy.user.username')
        } catch (error) {
            winston.error(`FileService._getFileForUpdate error: ${error}`)
            throw error
        }
    }

    _getPermissionFilter(permissionType, userId) {
        try {
            return permissionType === FILE_SHOW_ALL ? {} : { 'createdBy.user': userId }
        } catch (error) {
            winston.error(`FileService._getPermissionFilter error: ${error}`)
            throw error
        }
    }

    async _deleteFilesBatch(files) {
        try {
            if (!files || !files.length) return

            const deletePromises = files.map(async file => {
                try {
                    await fs.promises.unlink(file.relativePath)
                    await updateUserUsedStorage(file.createdBy.user, -file.size)
                } catch (error) {
                    winston.error(`Error deleting file ${file.relativePath}: ${error}`)
                    throw error
                }
            })

            await Promise.all(deletePromises)
            const fileIds = files.map(file => file._id)
            return await File.deleteMany({ _id: { $in: fileIds } })
        } catch (error) {
            winston.error(`FileService._deleteFilesBatch error: ${error}`)
            throw error
        }
    }

    _validateExpirationDate(expirationTime) {
        try {
            if (!expirationTime) return 0
            
            const today = new Date()
            const expirationDate = new Date(expirationTime)
            
            if (expirationDate > today) return (expirationDate - today) / (1000 * 3600 * 24)

            return 0
        } catch (error) {
            winston.error(`FileService._validateExpirationDate error: ${error}`)
            throw error
        }
    }
}

export default new FileService()