import { updateUserUsedStorage, findUserStorageByUser } from './UserStorageService'
import { FILE_SHOW_ALL, FILE_SHOW_OWN } from '../permissions/File'
import { DefaultLogger as winston } from '@dracul/logger-backend'
import { GroupService, UserService } from '@dracul/user-backend'
import { storeFile } from '@dracul/common-backend'
import { createAudit } from '@dracul/audit-backend'
import { mediaCache as cache } from '../cache'
import File from '../models/FileModel'
import FileDTO from '../DTOs/FileDTO'
import dayjs from 'dayjs'
import fs from 'fs/promises'
import EventEmitter from 'events'

const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

class FileService extends EventEmitter {

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

    async getFilePrivacyByRelativePath(relativePath){
        if (!relativePath) throw new Error('relativePath field is required')

        try {
            const file = await File.findOne({ relativePath }).select('isPublic').lean()

            console.log("file: ", file)
            return file
        } catch (error) {
            winston.error(`FileService.getFilePrivacyByRelativePath error: ${error}`)
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

    async updateFile(authUser, newFile, data, userId, allFilesAllowed, ownFilesAllowed, publicAllowed) {
        try {
            const { id, description, tags, expirationDate, isPublic, groups, users } = data

            let formattedExpirationDate = expirationDate
            if (expirationDate) {
                const userProvidedDate = dayjs(expirationDate)
                if (userProvidedDate.isValid()) {
                     formattedExpirationDate = userProvidedDate.toDate()
                }
                
                // Validate against user storage limits
                const userStorage = await findUserStorageByUser(authUser)
                if (userStorage) {
                     const timeDiff = this._validateExpirationDate(formattedExpirationDate)
                     if (timeDiff > userStorage.fileExpirationTime) {
                         throw new Error(`File expiration exceeds maximum of ${userStorage.fileExpirationTime} days`)
                     }
                }
            }

            const updatedFile = await this._updateFileDocument(
                id,
                { description, tags, expirationDate: formattedExpirationDate, isPublic, groups, users },
                userId,
                allFilesAllowed,
                ownFilesAllowed,
                publicAllowed
            )

            if (updatedFile && updatedFile.relativePath) cache.delete(updatedFile.relativePath)
            if (newFile) await this._replaceFileContent(updatedFile, newFile, userId, authUser.username)

            if (updatedFile && expirationDate) {
                this.emit('expirationChanged')
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
            if (fileDocument) await this._replaceFileContent(fileDocument, newFile, user.id, user.username)
            return true
        } catch (error) {
            winston.error(`FileService.updateFileRest error: ${error}`)
            return false
        }
    }

    async updateFileMetadata(id, user, permissionType, metadata) {
        try {
            const { description, expirationDate, tags, isPublic } = metadata
            if (!description && !expirationDate && !tags && !isPublic) throw new Error('File fields to update were not provided')

            const userProvidedDate = expirationDate ? dayjs(expirationDate) : null
            if (userProvidedDate && !userProvidedDate.isValid()) throw new Error('Invalid date format')

            const userStorage = await findUserStorageByUser(user)
            const formattedExpirationDate = userProvidedDate ? userProvidedDate.toDate() : null
            
            if (formattedExpirationDate) {
                const timeDiff = this._validateExpirationDate(formattedExpirationDate)
                if (timeDiff > userStorage.fileExpirationTime) throw new Error(`File expiration exceeds maximum of ${userStorage.fileExpirationTime} days`)
            }
            
            const updatedFile = await File.findOneAndUpdate(
                { _id: id, ...this._getPermissionFilter(permissionType, user.id) },
                { $set: { description, expirationDate: formattedExpirationDate, tags, isPublic } },
                { new: true }
            )

            if (!updatedFile) throw new Error(`File not found with id ${id}`)
            if (updatedFile && updatedFile.relativePath) cache.delete(updatedFile.relativePath)

            this.emit('expirationChanged')

            return updatedFile
        } catch (error) {
            winston.error(`FileService.updateFileMetadata error: ${error}`)
            throw error
        }
    }

    async updateByRelativePath(relativePath) {
        try {
            return await File.findOneAndUpdate(
                { relativePath },
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

            const authUser = await UserService.findUser(userId)
            const success = await this._robustDelete(file, 'FILE_DELETED', `File ${file.relativePath} deleted by user ${userId}`, authUser)
            return { id, success }
        } catch (error) {
            winston.error(`FileService.deleteFile error: ${error}`)
            throw error
        }
    }

    /**
     * Finds and deletes all expired files.
     * @returns The number of deleted files.
     */
    async executeCleanup() {
        winston.info("FileService.executeCleanup started")
        let deletedCount = 0
        let errorCount = 0

        try {
            const now = new Date()
            winston.info(`FileService.executeCleanup: checking expirations at ${now.toISOString()}`)

            // 1. Delete by explicit expirationDate
            const explicitCursor = File.find({
                expirationDate: { $ne: null, $lte: now }
            }).cursor()

            for await (const doc of explicitCursor) {
                winston.info(`FileService.executeCleanup: deleting explicit expired file ${doc.filename}`)
                const success = await this._robustDelete(doc, 'FILE_DELETED_BY_EXPIRATION', `File ${doc.relativePath} automatically deleted by expiration job`)
                success ? deletedCount++ : errorCount++
            }

            // 2. Delete by UserStorage policy
            winston.info("FileService.executeCleanup: running policy aggregation...")
            
            // Debug: Check how many files have expirationDate: null
            const totalFilesWithoutExp = await File.countDocuments({ expirationDate: { $eq: null } })
            winston.info(`FileService.executeCleanup: total files without explicit expiration: ${totalFilesWithoutExp}`)

            const policyCursor = File.aggregate([
                { $match: { expirationDate: { $eq: null } } },
                { $lookup: { from: 'userstorages', localField: 'createdBy.user', foreignField: 'user', as: 'storage' } },
                { $unwind: '$storage' },
                { $addFields: {
                    expireAt: {
                        $add: [
                            '$createdAt',
                            { $multiply: ['$storage.fileExpirationTime', 24 * 60 * 60 * 1000] }
                        ]
                    }
                }},
                { $match: { expireAt: { $lte: now } } }
            ]).cursor()

            let policyCount = 0
            for await (const doc of policyCursor) {
                policyCount++
                winston.info(`FileService.executeCleanup: deleting policy expired file ${doc.filename}`)
                const success = await this._robustDelete(doc, 'FILE_DELETED_BY_EXPIRATION', `File ${doc.relativePath} automatically deleted by expiration job (policy)`)
                success ? deletedCount++ : errorCount++
            }
            winston.info(`FileService.executeCleanup: policy aggregation found ${policyCount} files to delete`)

            return { deletedCount, errorCount }
        } catch (error) {
            winston.error(`FileService.executeCleanup error: ${error}`)
            throw error
        }
    }

    /**
     * Calculates when the next file will expire.
     */
    async getNextExpirationTimestamp() {
        try {
            const now = new Date()

            // Next explicit expiration
            const nextExplicit = await File.findOne({
                expirationDate: { $gt: now }
            }).sort({ expirationDate: 1 }).select('expirationDate').lean()

            // Next policy-based expiration
            const nextPolicy = await File.aggregate([
                { $match: { expirationDate: { $eq: null } } },
                { $lookup: { from: 'userstorages', localField: 'createdBy.user', foreignField: 'user', as: 'storage' } },
                { $unwind: '$storage' },
                { $project: {
                    expireAt: {
                        $add: [
                            '$createdAt',
                            { $multiply: ['$storage.fileExpirationTime', 24 * 60 * 60 * 1000] }
                        ]
                    }
                }},
                { $match: { expireAt: { $gt: now } } },
                { $sort: { expireAt: 1 } },
                { $limit: 1 }
            ])

            const explicitTs = nextExplicit?.expirationDate ? new Date(nextExplicit.expirationDate).getTime() : Infinity
            const policyTs = nextPolicy[0]?.expireAt ? new Date(nextPolicy[0].expireAt).getTime() : Infinity

            const soonest = Math.min(explicitTs, policyTs)
            return soonest === Infinity ? null : soonest
        } catch (error) {
            winston.error(`FileService.getNextExpirationTimestamp error: ${error}`)
            return null
        }
    }

    // Compatibility methods
    async findAndDeleteExpiredFiles() { return this.executeCleanup() }
    async findAndDeleteByExpirationDate() { return this.executeCleanup() }


    _filterByPermissions(userId, allFilesAllowed, ownFilesAllowed, publicAllowed, userGroups = []) {
        try {
            if (allFilesAllowed) return {}
            if (ownFilesAllowed && publicAllowed) {
                return { $or: [ { 'createdBy.user': userId }, { isPublic: true }, { groups: { $in: userGroups } }, { users: { $in: [userId] } } ] }
            }
            if (ownFilesAllowed) {
                return { $or: [ { 'createdBy.user': userId }, { groups: { $in: userGroups } }, { users: { $in: [userId] } } ] }
            }
            if (publicAllowed) {
                return { $or: [ { isPublic: true }, { groups: { $in: userGroups } }, { users: { $in: [userId] } } ] }
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
            return { $and: [ { createdAt: { $gte: start } }, { createdAt: { $lte: end } } ] }
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
                        return { ...query, createdAt: { ...query.createdAt, [operator]: new Date(value) } }
                    case 'dateTo':
                        return { ...query, createdAt: { ...query.createdAt, [operator]: dayjs(value).add(1, 'day').toDate() } }
                    case 'filename':
                        return { ...query, filename: { [operator]: value, $options: 'i' } }
                    case 'createdBy.user':
                        return { ...query, 'createdBy.user': { [operator]: value } }
                    case 'type':
                        return { ...query, type: { [operator]: value, $options: 'i' } }
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
            return { ...paginationResult, items: paginationResult.items.map(item => new FileDTO(item)) }
        } catch (error) {
            winston.error(`FileService._applySensitiveDataFilter error: ${error}`)
            throw error
        }
    }

    async _updateFileDocument(id, updateData, userId, allFilesAllowed, ownFilesAllowed, publicAllowed) {
        try {
            const userGroups = await GroupService.fetchMyGroups(userId)
            return await File.findOneAndUpdate(
                { _id: id, ...this._filterByPermissions(userId, allFilesAllowed, ownFilesAllowed, publicAllowed, userGroups) },
                updateData,
                { new: true, runValidators: true }
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
            file.fileReplaces.push({ user: userId, date: dayjs(), username })
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

            for (const file of files) {
                if (file && file.relativePath) cache.delete(file.relativePath)
            }

            const deletePromises = files.map(async file => {
                try {
                    await fs.unlink(file.relativePath)
                    await updateUserUsedStorage(file.createdBy.user, -file.size)
                } catch (error) {
                    winston.error(`Error deleting file ${file.relativePath}: ${error}`)
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

    async _robustDelete(file, action = 'FILE_DELETED', description = '', authUser = null) {
        try {
            if (file.relativePath) cache.delete(file.relativePath)

            try {
                await fs.unlink(file.relativePath)
            } catch (err) {
                if (err.code !== 'ENOENT') {
                    winston.error(`FileService._robustDelete: Error unlinking file ${file.relativePath}: ${err.message}`)
                    throw err
                }
            }

            await File.deleteOne({ _id: file._id })
            
            let creatorId = null
            if (file.createdBy && file.createdBy.user) {
                creatorId = file.createdBy.user._id || file.createdBy.user.id || file.createdBy.user
            }

            if (creatorId && typeof creatorId.toString === 'function') {
                const creatorIdString = creatorId.toString()
                if (creatorIdString.length === 24) {
                    await updateUserUsedStorage(creatorIdString, -file.size)
                }
            }

            // AUDIT
            try {
                let auditor = authUser
                if (!auditor) {
                    winston.info(`FileService._robustDelete: No authUser, trying to find file owner. File: ${file.filename}, createdBy: ${JSON.stringify(file.createdBy)}`)
                    
                    // Try to use the file owner as auditor
                    if (creatorId) {
                        winston.info(`FileService._robustDelete: Trying to find user by creatorId: ${creatorId}`)
                        auditor = await UserService.findUser(creatorId)
                        if (auditor) {
                            winston.info(`FileService._robustDelete: Found file owner: ${auditor.username}`)
                        } else {
                            winston.warn(`FileService._robustDelete: Could not find user with creatorId: ${creatorId}`)
                        }
                    } else {
                        winston.warn(`FileService._robustDelete: No creatorId found in file`)
                    }
                }

                if (!auditor) {
                    // Last resort: try root user
                    winston.info(`FileService._robustDelete: Trying root user as fallback`)
                    auditor = await UserService.findUserByUsername('root')
                    if (auditor) {
                        winston.info(`FileService._robustDelete: Using root user as auditor`)
                    }
                }

                if (auditor) {
                    await createAudit(auditor, {
                        action: action,
                        entity: 'File',
                        details: description || `File ${file.filename} deleted`,
                        resourceData: file,
                        resourceName: file.filename
                    })
                    winston.info(`FileService._robustDelete: Audit created successfully for file ${file.filename} by user ${auditor.username}`)
                } else {
                    winston.warn(`FileService._robustDelete: No auditor available, skipping audit for file ${file.filename}`)
                }
            } catch (auditError) {
                winston.error(`FileService._robustDelete Audit Error: ${auditError.message}`)
            }

            winston.info(`FileService._robustDelete: Deleted file ${file.relativePath}`)
            return true
        } catch (error) {
            winston.error(`FileService._robustDelete error for file ${file._id}: ${error}`)
            return false
        }
    }

    _validateExpirationDate(expirationTime) {
        try {
            if (!expirationTime) return 0
            const today = new Date()
            const expirationDate = new Date(expirationTime)
            return expirationDate > today ? (expirationDate - today) / (1000 * 3600 * 24) : 0
        } catch (error) {
            winston.error(`FileService._validateExpirationDate error: ${error}`)
            throw error
        }
    }
}

export default new FileService()