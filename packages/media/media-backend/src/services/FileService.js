import { updateUserUsedStorage, findUserStorageByUser } from './UserStorageService'
import userStorage from '../models/UserStorageModel'
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

/**
 * @description Número máximo de archivos a eliminar en paralelo durante el cleanup.
 * @type {number}
 */
const CLEANUP_CONCURRENCY = parseInt(process.env.MEDIA_CLEANUP_CONCURRENCY) || 20

/**
 * @description Tiempo en ms para considerar un archivo "próximo a expirar".
 * Se usa para optimizar la emisión del evento expirationChanged al acceder archivos.
 * @type {number}
 */
const NEAR_EXPIRATION_THRESHOLD_MS = parseInt(process.env.MEDIA_NEAR_EXPIRATION_THRESHOLD_MS) || 12 * 60 * 60 * 1000

class FileService extends EventEmitter {
    constructor() {
        super()
        this.isRunningCleanup = false
    }

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

            winston.debug(`FileService.getFilePrivacyByRelativePath: relativePath='${relativePath}', found=${!!file}, isPublic=${file?.isPublic}`)
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
            if (!fileDocument) return false
            await this._replaceFileContent(fileDocument, newFile, user.id, user.username)
            return true
        } catch (error) {
            winston.error(`FileService.updateFileRest error: ${error}`)
            return false
        }
    }

    async updateFileMetadata(id, user, permissionType, metadata) {
        try {
            const { description, expirationDate, tags, isPublic } = metadata
            if (description === undefined && expirationDate === undefined && tags === undefined && isPublic === undefined) {
                throw new Error('File fields to update were not provided')
            }

            const userProvidedDate = expirationDate ? dayjs(expirationDate) : null
            if (userProvidedDate && !userProvidedDate.isValid()) throw new Error('Invalid date format')

            const userStorage = await findUserStorageByUser(user)
            const formattedExpirationDate = userProvidedDate ? userProvidedDate.toDate() : null
            
            if (formattedExpirationDate) {
                const timeDiff = this._validateExpirationDate(formattedExpirationDate)
                if (timeDiff > userStorage.fileExpirationTime) throw new Error(`File expiration exceeds maximum of ${userStorage.fileExpirationTime} days`)
            }
            
            const userGroups = await GroupService.fetchMyGroups(user.id)
            const updateFields = {};
            if (description !== undefined) updateFields.description = description;
            if (expirationDate !== undefined) updateFields.expirationDate = formattedExpirationDate;
            if (tags !== undefined) updateFields.tags = tags;
            if (isPublic !== undefined) updateFields.isPublic = isPublic;
            
            const updatedFile = await File.findOneAndUpdate(
                { _id: id, ...this._getPermissionFilter(permissionType, user.id, userGroups) },
                { $set: updateFields },
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

    /**
     * @description Actualiza lastAccess cuando un archivo es descargado/accedido.
     *               Si el archivo está próximo a expirar, emite expirationChanged
     *               para que el scheduler recalcule y no lo borre prematuramente.
     * @async
     * @param {string} relativePath - Ruta relativa del archivo
     * @returns {Promise<Object|null>} Documento actualizado o null
     * @fires FileService#expirationChanged
     */
    async updateByRelativePath(relativePath) {
        try {
            const file = await File.findOne({ relativePath }).lean()
            if (!file) {
                return null
            }

            const wasNearExpiration = await this._isNearExpiration(file)

            const updatedFile = await File.findOneAndUpdate(
                { relativePath },
                { lastAccess: Date.now(), '$inc': { hits: 1 } },
                { runValidators: true, context: 'query', new: true }
            )

            if (wasNearExpiration) {
                this.emit('expirationChanged')
            }

            return updatedFile
        } catch (error) {
            winston.error(`FileService.updateByRelativePath error: ${error}`)
            throw error
        }
    }

    /**
     * @description Determina si un archivo está "próximo a expirar".
     *               Un archivo expira dentro del threshold si expireAt <= now + threshold.
     * @async
     * @param {Object} file - Documento lean del archivo
     * @returns {Promise<boolean>}
     */
    async _isNearExpiration(file) {
        try {
            if (!file || !file.createdBy || !file.createdBy.user) {
                return false
            }

            const userId = file.createdBy.user._id || file.createdBy.user
            const storage = await userStorage.findOne({ user: userId }).lean()

            if (!storage || !storage.fileExpirationTime) {
                return false
            }

            const now = Date.now()
            const fileExpirationMs = storage.fileExpirationTime * 24 * 60 * 60 * 1000

            const baseDate = storage.deleteByLastAccess
                ? file.lastAccess
                : file.createdAt

            const baseTimestamp = baseDate instanceof Date
                ? baseDate.getTime()
                : new Date(baseDate).getTime()

            const expireAt = baseTimestamp + fileExpirationMs

            if (expireAt <= now) {
                return false
            }

            return expireAt <= now + NEAR_EXPIRATION_THRESHOLD_MS
        } catch (error) {
            winston.error(`FileService._isNearExpiration error: ${error}`)
            return false
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
     * @description Busca y elimina todos los archivos expirados.
     *               1. Archivos con expirationDate explícita <= now
     *               2. Archivos por política (expireAt calculado desde lastAccess/createdAt + fileExpirationTime)
     * @async
     * @returns {Promise<{deletedCount: number, errorCount: number, skipped?: boolean}>}
     */
    async executeCleanup() {
        if (this.isRunningCleanup) {
            winston.info("FileService.executeCleanup: already running, skipping")
            return { deletedCount: 0, errorCount: 0, skipped: true }
        }

        this.isRunningCleanup = true
        winston.info("FileService.executeCleanup started")
        winston.info(`FileService.executeCleanup: concurrency level: ${CLEANUP_CONCURRENCY}`)

        let explicitDeleted = 0
        let explicitErrors = 0
        let policyDeleted = 0
        let policyErrors = 0

        try {
            const now = new Date()
            winston.info(`FileService.executeCleanup: checking expirations at ${now.toISOString()}`)

            // 1. Delete by explicit expirationDate
            const explicitFiles = await File.find({
                expirationDate: { $ne: null, $lte: now }
            }).lean()

            if (explicitFiles.length > 0) {
                winston.info(`FileService.executeCleanup: found ${explicitFiles.length} files with explicit expiration`)
                const explicitResult = await this._parallelDelete(
                    explicitFiles,
                    'FILE_DELETED_BY_EXPIRATION',
                    'File automatically deleted by explicit expiration date'
                )
                explicitDeleted = explicitResult.deletedCount
                explicitErrors = explicitResult.errorCount
                winston.info(`FileService.executeCleanup: explicit expiration deleted: ${explicitResult.deletedCount}, errors: ${explicitResult.errorCount}`)
            }

            // 2. Delete by UserStorage policy
            winston.info("FileService.executeCleanup: running policy aggregation...")

            const policyFiles = await File.aggregate([
                { $match: { expirationDate: { $eq: null } } },
                { $lookup: { from: 'userstorages', localField: 'createdBy.user', foreignField: 'user', as: 'storage' } },
                { $match: { storage: { $ne: [] } } },
                { $unwind: '$storage' },
                { $addFields: {
                    expireAt: {
                        $add: [
                            { $cond: ['$storage.deleteByLastAccess', '$lastAccess', '$createdAt'] },
                            { $multiply: ['$storage.fileExpirationTime', 24 * 60 * 60 * 1000] }
                        ]
                    },
                    policyType: { $cond: ['$storage.deleteByLastAccess', 'lastAccess', 'createdAt'] }
                }},
                { $match: { expireAt: { $lte: now } } }
            ])

            if (policyFiles.length > 0) {
                winston.info(`FileService.executeCleanup: found ${policyFiles.length} files expired by policy`)

                const byLastAccess = policyFiles.filter(f => f.policyType === 'lastAccess')
                const byCreatedAt = policyFiles.filter(f => f.policyType === 'createdAt')

                if (byLastAccess.length > 0) {
                    winston.info(`FileService.executeCleanup: ${byLastAccess.length} files by lastAccess policy`)
                    const lastAccessResult = await this._parallelDelete(
                        byLastAccess,
                        'FILE_DELETED_BY_EXPIRATION',
                        'File automatically deleted by lastAccess policy'
                    )
                    policyDeleted += lastAccessResult.deletedCount
                    policyErrors += lastAccessResult.errorCount
                    winston.info(`FileService.executeCleanup: lastAccess policy deleted: ${lastAccessResult.deletedCount}, errors: ${lastAccessResult.errorCount}`)
                }

                if (byCreatedAt.length > 0) {
                    winston.info(`FileService.executeCleanup: ${byCreatedAt.length} files by createdAt policy`)
                    const createdAtResult = await this._parallelDelete(
                        byCreatedAt,
                        'FILE_DELETED_BY_EXPIRATION',
                        'File automatically deleted by createdAt policy'
                    )
                    policyDeleted += createdAtResult.deletedCount
                    policyErrors += createdAtResult.errorCount
                    winston.info(`FileService.executeCleanup: createdAt policy deleted: ${createdAtResult.deletedCount}, errors: ${createdAtResult.errorCount}`)
                }
            }

            const totalDeleted = explicitDeleted + policyDeleted
            const totalErrors = explicitErrors + policyErrors
            winston.info(`FileService.executeCleanup: finished. Total files deleted: ${totalDeleted}, errors: ${totalErrors}`)

            return { deletedCount: totalDeleted, errorCount: totalErrors }
        } catch (error) {
            winston.error(`FileService.executeCleanup error: ${error}`)
            throw error
        } finally {
            this.isRunningCleanup = false
        }
    }

    /**
     * @description Divide un array en chunks de tamaño específico.
     * @param {Array} array - Array a dividir
     * @param {number} size - Tamaño máximo de cada chunk
     * @returns {Array<Array>}
     */
    _chunkArray(array, size) {
        const chunks = []
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size))
        }
        return chunks
    }

    /**
     * @description Elimina múltiples archivos en paralelo controlando la concurrencia.
     * @async
     * @param {Array<Object>} files - Archivos a eliminar
     * @param {string} action - Tipo de acción para auditoría
     * @param {string} description - Descripción para auditoría
     * @returns {Promise<{deletedCount: number, errorCount: number}>}
     */
    async _parallelDelete(files, action, description) {
        if (!files || !files.length) return { deletedCount: 0, errorCount: 0 }

        const chunks = this._chunkArray(files, CLEANUP_CONCURRENCY)
        let deletedCount = 0
        let errorCount = 0

        for (const chunk of chunks) {
            const promises = chunk.map(file =>
                this._robustDelete(file, action, description)
                    // _robustDelete returns true on success, false on failure
                    .then(success => success ? 1 : 0)
                    .catch(error => {
                        winston.error(`FileService._parallelDelete: Error deleting file ${file.filename} (${file._id}): ${error.message}`)
                        return -1 // Marker: -1 means promise rejected (exception), 0 means resolved false (intentional failure)
                    })
            )
            const results = await Promise.all(promises)
            // Count results: 1=success, 0 or -1=failure
            for (const res of results) {
                if (res === 1) deletedCount++
                else if (res === 0 || res === -1) errorCount++
            }
        }

        return { deletedCount, errorCount }
    }

    /**
     * @description Calcula el timestamp de la próxima expiración de archivo.
     *               Busca tanto expiraciones explícitas como por política.
     * @async
     * @returns {Promise<number|null>} Timestamp en ms o null si no hay archivos pendientes
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
                { $match: { storage: { $ne: [] } } },
                { $unwind: '$storage' },
                { $project: {
                    expireAt: {
                        $add: [
                            { $cond: ['$storage.deleteByLastAccess', '$lastAccess', '$createdAt'] },
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
            const oldSize = file.size || 0
            const newExtension = '.' + (await newFile).filename.split('.').pop()
            if (file.extension !== newExtension) throw new Error('File extension mismatch during update')
            
            await storeFile((await newFile).createReadStream(), file.relativePath)
            const stats = await fs.stat(file.relativePath)
            const newSizeMB = stats.size / (1024 * 1024)
            
            if (oldSize > 0) {
                await updateUserUsedStorage(userId, -oldSize)
            }
            await updateUserUsedStorage(userId, newSizeMB)
            
            file.size = newSizeMB
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
            return await File.findOne({ _id: id, ...this._filterByPermissions(user.id, showAll, showOwn, false) })
                .populate('createdBy.user.username')
        } catch (error) {
            winston.error(`FileService._getFileForUpdate error: ${error}`)
            throw error
        }
    }

    _getPermissionFilter(permissionType, userId, userGroups = []) {
        try {
            if (permissionType === FILE_SHOW_ALL) return {}
            return {
                $or: [
                    { 'createdBy.user': userId },
                    { users: { $in: [userId] } },
                    { groups: { $in: userGroups } }
                ]
            }
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

    /**
     * @description Elimina un archivo de forma robusta.
     *               1) Limpia caché, 2) Verifica existencia en DB, 3) Elimina del disco,
     *               4) Elimina de MongoDB, 5) Actualiza usedSpace, 6) Registra auditoría.
     * @async
     * @param {Object} file - Documento del archivo
     * @param {string} [action='FILE_DELETED'] - Acción para auditoría
     * @param {string} [description=''] - Descripción para auditoría
     * @param {Object} [authUser=null] - Usuario autenticado
     * @returns {Promise<boolean>}
     */
    async _robustDelete(file, action = 'FILE_DELETED', description = '', authUser = null) {
        try {
            if (file.relativePath) cache.delete(file.relativePath)

            const existingFile = await File.findOne({ _id: file._id }).lean();
            if (!existingFile) {
                winston.info(`FileService._robustDelete: File ${file._id} already deleted or not found, skipping`);
                return true;
            }

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
            if (existingFile.createdBy && existingFile.createdBy.user) {
                creatorId = existingFile.createdBy.user._id || existingFile.createdBy.user.id || existingFile.createdBy.user
            }

            if (creatorId && typeof creatorId.toString === 'function') {
                const creatorIdString = creatorId.toString()
                if (creatorIdString.length === 24) {
                    await updateUserUsedStorage(creatorIdString, -existingFile.size)
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