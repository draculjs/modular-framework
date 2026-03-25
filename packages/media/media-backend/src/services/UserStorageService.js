import userStorage from "../models/UserStorageModel";
import { UserService } from '@dracul/user-backend';
import { UserInputError } from "apollo-server-errors";
import { DefaultLogger as winston } from '@dracul/logger-backend';
import FileService from './FileService';

export const fetchUserStorage = async function () {
    try {
        return await userStorage.find({}).populate('user');
    } catch (error) {
        winston.error(`An error happened at the fetchUserStorage function: ${error}`);
    }
}

export const getLimitedInfoAboutUserStorages = async function () {
    try {
        return await userStorage.find({}).populate('user', ["username"]);
    } catch (error) {
        winston.error(`An error happened at the getLimitedInfoAboutUserStorages function: ${error}`);
    }
}

export const getUserStoragesByUsedPercentage = async (usedPercentage) => {
    try {
        const usedUserStorages = await getLimitedInfoAboutUserStorages();
        const filteredUserStorages = usedUserStorages.filter(userStorage => {
            const percentage = parseFloat(userStorage.usedSpace * 100 / userStorage.capacity).toFixed(2);
            return percentage >= usedPercentage;
        });
        return filteredUserStorages;
    } catch (error) {
        winston.error(`An error happened at the getUserStoragesByUsedPercentage function: ${error}`);
    }
}

export const findUserStorageByUser = async function (user) {
    try {
        return (await userStorage.findOne({ user: user.id }).populate('user').exec())
    } catch (error) {
        winston.error(`An error happened at the findUserStorageByUser function: ${error}`);
    }
}

export const userStorageCheckAndCreate = async function () {
    const userStorages = await userStorage.find({}).populate('user');
    const userStoragesIds = userStorages.filter(us => us.user).map(us => us.user.id);
    const users = await UserService.findUsers();
    const usersWithoutStorage = users.filter(u => !userStoragesIds.includes(u.id));

    for (let user of usersWithoutStorage) {
        const capacity = process.env.MEDIA_DEFAULT_CAPACITY ? process.env.MEDIA_DEFAULT_CAPACITY : 0;
        const usedSpace = 0;
        const maxFileSize = process.env.MEDIA_MAX_SIZE_PER_FILE_IN_MEGABYTES || 1024;
        const fileExpirationTime = process.env.MEDIA_FILE_EXPIRATION_TIME_IN_DAYS || 365;
        const deleteByLastAccess = true;
        const deleteByCreatedAt = false;
        const filesPrivacy = 'private';

        await createUserStorage(user, capacity, usedSpace, maxFileSize, fileExpirationTime, deleteByLastAccess, deleteByCreatedAt, filesPrivacy);
    }

    return true;
}

export const createUserStorage = async function (user, capacity, usedSpace, maxFileSize, fileExpirationTime, deleteByLastAccess, deleteByCreatedAt, filesPrivacy) {
    const doc = new userStorage(
        {
            user,
            capacity,
            usedSpace,
            maxFileSize,
            fileExpirationTime,
            deleteByLastAccess,
            deleteByCreatedAt,
            filesPrivacy
        }
    )

    try {
        await doc.save()
        winston.info("Media UserStorage createUserStorage for: " + user.username)
        return doc
    } catch (error) {
        if (error.name == "ValidationError") {
            throw new UserInputError(error.message, { inputErrors: error.errors })
        }
        
        throw error
    }
}

/**
 * @description Actualiza el espacio usado por un usuario. Previene valores negativos.
 * @async
 * @param {string|ObjectId} userId - ID del usuario
 * @param {number} size - Tamaño a agregar (positivo) o restar (negativo) en MB
 * @returns {Promise<Object|null>}
 */
export const updateUserUsedStorage = async function (userId, size) {
    try {
        const current = await userStorage.findOne({ user: userId });
        
        if (!current) {
            winston.warn(`updateUserUsedStorage: User storage not found for user ${userId}`);
            return null;
        }

        if (typeof size !== 'number' || isNaN(size)) {
            winston.warn(`updateUserUsedStorage: Invalid size provided: ${size}`);
            return null;
        }

        // aggregation pipeline to "clamp" to 0 usedSpace
        const result = await userStorage.findOneAndUpdate(
            { user: userId },
            [
                {
                    $set: {
                        usedSpace: {
                            $max: [0, { $add: ["$usedSpace", size] }]
                        }
                    }
                }
            ],
            { runValidators: true, context: "query", new: true }
        );

        if (!result) {
            winston.warn(`updateUserUsedStorage: User storage not found for user ${userId}`);
        }

        return result
    } catch (error) {
        if (error.name == "ValidationError") {
            throw new UserInputError(error.message, { inputErrors: error.errors });
        }
        throw error;
    }
}

export const updateUserStorage = async function (authUser, id,
    {
        name,
        capacity,
        usedSpace,
        maxFileSize,
        fileExpirationTime,
        deleteByLastAccess,
        deleteByCreatedAt,
        filesPrivacy
    }
) {
    try {
        const result = await userStorage.findOneAndUpdate(
            { _id: id },
            { capacity, maxFileSize, fileExpirationTime, deleteByLastAccess, deleteByCreatedAt, filesPrivacy },
            { runValidators: true, context: "query", new: true }
        );

        if (FileService && typeof FileService.emit === 'function') {
            FileService.emit('expirationChanged');
            winston.info('UserStorageService: Emitted expirationChanged after policy update');
        }

        return result;
    } catch (error) {
        if (error.name == "ValidationError") {
            throw new UserInputError(error.message, { inputErrors: error.errors });
        }
        throw error;
    }
}

export const checkUserStorage = async function (userId, newFileSize) {
    try {
        const res = await userStorage.findOne({ user: userId });
        if (!res) return false;
        
        const spaceLeft = res.capacity - res.usedSpace;
        return spaceLeft >= newFileSize;
    } catch (e) {
        throw e;
    }
}

export const checkUserStorageLeft = async function (userId) {
    if (!userId) {
        throw new Error("checkUserStorageLeft: UserId must be provided");
    }
    try {
        const doc = await userStorage.findOne({ user: userId });
        if (doc) {
            return doc.capacity - doc.usedSpace;
        } else {
            return 0;
        }
    } catch (e) {
        throw e;
    }
}

/**
 * @description Detecta y corrige inconsistencias en usedSpace de usuarios.
 *              Verifica: 1) usedSpace vs suma de archivos, 2) archivos en DB sin archivo en disco,
 *              3) archivos en disco sin registro en DB.
 * @async
 * @returns {Promise<number>} Cantidad de usedSpaces corregidos
 */
export const fixUsedSpaceInconsistencies = async function () {
    try {
        const File = require('../models/FileModel');
        const { scanUserFiles } = require('./helpers/scanUserFiles');
        const fs = require('fs');
        
        const userStorages = await userStorage.find({}).lean();
        const allDiskFiles = await scanUserFiles();
        let fixedCount = 0;
        
        for (const userStorageDoc of userStorages) {
            const userIdRaw = userStorageDoc.user;
            
            if (!userIdRaw) continue;
            
            const userIdStr = userIdRaw.toString();
            
            const files = await File.find({ 'createdBy.user': userIdRaw }).lean();
            const realUsedSpace = files.reduce((sum, file) => sum + (file.size || 0), 0);
            
            const dbPaths = new Set(files.map(f => f.relativePath));
            
            const orphansOnDB = files.filter(f => {
                const foundInScan = allDiskFiles.find(df => df.relativePath === f.relativePath);
                if (foundInScan) return false;
                
                const existsAtAbsolutePath = f.absolutePath && fs.existsSync(f.absolutePath);
                if (existsAtAbsolutePath) {
                    winston.debug(`fixUsedSpaceInconsistencies: File exists at absolutePath (different directory): "${f.absolutePath}"`);
                    return false;
                }
                
                winston.debug(`fixUsedSpaceInconsistencies: DB path not found on disk: "${f.relativePath}"`);
                return true;
            });
            
            const orphansOnDisk = allDiskFiles.filter(f => 
                f.relativePath.includes(`/files/${userIdStr}/`) &&
                !dbPaths.has(f.relativePath)
            );
            
            if (Math.abs(realUsedSpace - userStorageDoc.usedSpace) > 0.001) {
                winston.warn(`fixUsedSpaceInconsistencies: User ${userIdStr}: usedSpace ${userStorageDoc.usedSpace?.toFixed(2) || 0} → ${realUsedSpace.toFixed(2)} MB (diff: ${(realUsedSpace - userStorageDoc.usedSpace).toFixed(2)} MB)`);
                
                await userStorage.updateOne(
                    { _id: userStorageDoc._id },
                    { $set: { usedSpace: realUsedSpace } }
                );
                fixedCount++;
            }
            
            if (orphansOnDisk.length > 0) {
                const totalOrphanSize = orphansOnDisk.reduce((sum, f) => sum + f.size, 0);
                const sampleFiles = orphansOnDisk.slice(0, 3).map(f => f.absolutePath).join(', ');
                winston.warn(`fixUsedSpaceInconsistencies: User ${userIdStr}: ${orphansOnDisk.length} orphaned files on disk (not in DB) - total: ${totalOrphanSize.toFixed(2)} MB - ${sampleFiles}${orphansOnDisk.length > 3 ? '...' : ''}`);
            }
            
            if (orphansOnDB.length > 0) {
                const sampleFiles = orphansOnDB.slice(0, 3).map(f => f.absolutePath || f.relativePath).join(', ');
                winston.error(`fixUsedSpaceInconsistencies: User ${userIdStr}: ${orphansOnDB.length} orphaned files in DB (not on disk) - ${sampleFiles}${orphansOnDB.length > 3 ? '...' : ''}`);
            }
        }
        
        if (fixedCount > 0) {
            winston.info(`fixUsedSpaceInconsistencies: Checked ${userStorages.length} users, fixed ${fixedCount} usedSpace inconsistencies`);
        } else {
            winston.info(`fixUsedSpaceInconsistencies: Checked ${userStorages.length} users, no usedSpace inconsistencies found`);
        }
        
        return fixedCount;
    } catch (error) {
        winston.error(`fixUsedSpaceInconsistencies error: ${error}`);
        throw error;
    }
}
