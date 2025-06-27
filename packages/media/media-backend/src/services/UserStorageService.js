import userStorage from "../models/UserStorageModel";
import { UserService } from '@dracul/user-backend';
import { UserInputError } from "apollo-server-errors";
import { DefaultLogger as winston } from '@dracul/logger-backend';

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

        await createUserStorage(user, capacity, usedSpace, maxFileSize, fileExpirationTime, deleteByLastAccess, deleteByCreatedAt);
    }

    return true;
}

export const createUserStorage = async function (user, capacity, usedSpace, maxFileSize, fileExpirationTime, deleteByLastAccess, deleteByCreatedAt) {
    const doc = new userStorage({
        user, capacity, usedSpace, maxFileSize, fileExpirationTime, deleteByLastAccess, deleteByCreatedAt
    });
    try {
        await doc.save();
        winston.info("Media UserStorage createUserStorage for: " + user.username);
        return doc;
    } catch (error) {
        if (error.name == "ValidationError") {
            throw new UserInputError(error.message, { inputErrors: error.errors });
        }
        throw error;
    }
}

export const updateUserUsedStorage = async function (userId, size) {
    try {
        return await userStorage.findOneAndUpdate(
            { user: userId },
            { $inc: { usedSpace: size } },
            { runValidators: true, context: "query" }
        );
    } catch (error) {
        if (error.name == "ValidationError") {
            throw new UserInputError(error.message, { inputErrors: error.errors });
        }
        throw error;
    }
}

export const updateUserStorage = async function (authUser, id, { name, capacity, usedSpace, maxFileSize, fileExpirationTime, deleteByLastAccess, deleteByCreatedAt }) {
    try {
        return await userStorage.findOneAndUpdate(
            { _id: id },
            { capacity, maxFileSize, fileExpirationTime, deleteByLastAccess, deleteByCreatedAt },
            { runValidators: true, context: "query" }
        );
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
