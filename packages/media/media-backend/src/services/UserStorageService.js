import userStorage from "../models/UserStorageModel.js";
import { UserService } from '@dracul/user-backend';
import { UserInputError } from "apollo-server-errors";
import { DefaultLogger as winston } from '@dracul/logger-backend';

export const fetchUserStorage = async function () {
    try {
        return await userStorage.find({}).populate('user');
    } catch (error) {
        winston.error(`fetchUserStorage error: ${error}`);
        throw error;
    }
}

export const getLimitedInfoAboutUserStorages = async function () {
    try {
        return await userStorage.find({}).populate('user', ["username"]);
    } catch (error) {
        winston.error(`getLimitedInfoAboutUserStorages error: ${error}`);
        throw error;
    }
}

export const getUserStoragesByUsedPercentage = async (usedPercentage) => {
    try {
        const usedUserStorages = await getLimitedInfoAboutUserStorages();
        return usedUserStorages.filter(storage => {
            const percentage = (storage.usedSpace * 100) / storage.capacity;
            return percentage >= usedPercentage;
        });
    } catch (error) {
        winston.error(`getUserStoragesByUsedPercentage error: ${error}`);
        throw error;
    }
}

export const findUserStorageByUser = async function (user) {
    try {
        winston.debug(`findUserStorageByUser for user ID: ${user.id}`);
        return await userStorage.findOne({ user: user.id }).populate('user').exec();
    } catch (error) {
        winston.error(`findUserStorageByUser error: ${error}`);
        throw error;
    }
}

export const userStorageCheckAndCreate = async function () {
    try {
        const userStorages = await userStorage.find({}).populate('user');
        const existingUserIds = userStorages.map(us => us.user?.id?.toString());
        
        const users = await UserService.findUsers();
        const usersWithoutStorage = users.filter(
            u => !existingUserIds.includes(u.id.toString())
        );

        for (let user of usersWithoutStorage) {
            await createDefaultUserStorage(user);
        }

        winston.info(`Checked user storages: Created ${usersWithoutStorage.length} new storages`);
        return true;
    } catch (error) {
        winston.error(`userStorageCheckAndCreate error: ${error}`);
        throw error;
    }
}

async function createDefaultUserStorage(user) {
    const capacity = process.env.MEDIA_DEFAULT_CAPACITY || 1073741824; // 1GB por defecto
    const maxFileSize = process.env.MEDIA_MAX_SIZE_PER_FILE_IN_MEGABYTES 
        ? parseInt(process.env.MEDIA_MAX_SIZE_PER_FILE_IN_MEGABYTES) * 1048576 
        : 104857600; // 100MB por defecto
        
    const fileExpirationTime = process.env.MEDIA_FILE_EXPIRATION_TIME_IN_DAYS || 365;
    
    return createUserStorage(
        user, 
        capacity,
        0, // usedSpace
        maxFileSize,
        fileExpirationTime,
        true,  // deleteByLastAccess
        false // deleteByCreatedAt
    );
}

export const createUserStorage = async function (user, capacity, usedSpace, maxFileSize, fileExpirationTime, deleteByLastAccess, deleteByCreatedAt) {
    try {
        const doc = new userStorage({
            user, 
            capacity, 
            usedSpace, 
            maxFileSize, 
            fileExpirationTime, 
            deleteByLastAccess, 
            deleteByCreatedAt
        });
        
        await doc.save();
        winston.info(`Created user storage for: ${user.username}`);
        return doc;
    } catch (error) {
        if (error.name == "ValidationError") {
            throw new UserInputError(error.message, { inputErrors: error.errors });
        }
        winston.error(`createUserStorage error: ${error}`);
        throw error;
    }
}

export const updateUserUsedStorage = async function (userId, size) {
    try {
        const result = await userStorage.findOneAndUpdate(
            { user: userId },
            { $inc: { usedSpace: size } },
            { new: true, runValidators: true, context: "query" }
        );
        
        if (!result) {
            winston.warn(`updateUserUsedStorage: No storage found for user ${userId}`);
        }
        return result;
    } catch (error) {
        if (error.name == "ValidationError") {
            throw new UserInputError(error.message, { inputErrors: error.errors });
        }
        winston.error(`updateUserUsedStorage error: ${error}`);
        throw error;
    }
}

export const updateUserStorage = async function (authUser, id, { capacity, maxFileSize, fileExpirationTime, deleteByLastAccess, deleteByCreatedAt }) {
    try {
        const result = await userStorage.findOneAndUpdate(
            { _id: id },
            { capacity, maxFileSize, fileExpirationTime, deleteByLastAccess, deleteByCreatedAt },
            { new: true, runValidators: true, context: "query" }
        );
        
        if (!result) {
            throw new Error(`User storage with ID ${id} not found`);
        }
        
        winston.info(`Updated user storage for ID: ${id}`);
        return result;
    } catch (error) {
        if (error.name == "ValidationError") {
            throw new UserInputError(error.message, { inputErrors: error.errors });
        }
        winston.error(`updateUserStorage error: ${error}`);
        throw error;
    }
}

export const checkUserStorage = async function (userId, newFileSize) {
    try {
        const storage = await userStorage.findOne({ user: userId });
        if (!storage) {
            winston.warn(`checkUserStorage: No storage found for user ${userId}`);
            return false;
        }
        return (storage.capacity - storage.usedSpace) >= newFileSize;
    } catch (error) {
        winston.error(`checkUserStorage error: ${error}`);
        throw error;
    }
}

export const checkUserStorageLeft = async function (userId) {
    if (!userId) {
        throw new Error("checkUserStorageLeft: UserId must be provided");
    }
    
    try {
        const storage = await userStorage.findOne({ user: userId });
        return storage ? storage.capacity - storage.usedSpace : 0;
    } catch (error) {
        winston.error(`checkUserStorageLeft error: ${error}`);
        throw error;
    }
}