import userStorage from "../models/UserStorageModel";
import { UserService } from '@dracul/user-backend';
import { UserInputError } from "apollo-server-errors";
import { DefaultLogger as winston } from '@dracul/logger-backend';


export const fetchUserStorage = async function () {
    try {
        return (await userStorage.find({}).populate('user').exec())
    } catch (error) {
        winston.error(`An error happened at the fetchUserStorage function: ${error}`)
    }
}

/**
 * This function retrieves limited information about user storages; only the username.
 * @returns {Promise<Array>} A promise that resolves to an array of user storages with limited information (the username).
 */
export const getLimitedInfoAboutUserStorages = async function () {
    try {
        return (await userStorage.find({}).populate('user', ["username"]).exec())
    } catch (error) {
        winston.error(`An error happened at the getLimitedInfoAboutUserStorages function: ${error}`)
    }
}

/**
 * This function retrieves user storages filtered by a given used percentage.
 * @param {number} usedPercentage - The used percentage to filter user storages by.
 * @returns {Promise<Array>} A promise that resolves to an array of user storages filtered by the used percentage. If an error occurs, it returns undefined.
 */
export const getUserStoragesByUsedPercentage = async (usedPercentage) => {
    try {
        const usedUserStorages = await getLimitedInfoAboutUserStorages()
        const filteredUserStorages = usedUserStorages.filter(userStorage => {
            const percentage = parseFloat(userStorage.usedSpace * 100 / userStorage.capacity).toFixed(2)
            return percentage >= usedPercentage
        })

        return filteredUserStorages
    } catch (error) {
        winston.error(`An error happened at the getUserStoragesByUsedPercentage function: ${error}`)
    }
}

export const findUserStorageByUser = async function (user) {
    try {
        return (await userStorage.findOne({ user: user.id }).populate('user').exec())
    } catch (error) {
        winston.error(`An error happened at the findUserStorageByUser function: ${error}`)
    }
}

export const userStorageCheckAndCreate = async function () {
    const userStorages = await userStorage.find({}).populate('user').exec()
    const userStoragesIds = userStorages.filter(us => us.user).map(us => us.user.id)

    const users = await UserService.findUsers()
    const usersWithoutStorage = users.filter(u => !userStoragesIds.includes(u.id))


    for (let user of usersWithoutStorage) {
        const capacity = process.env.MEDIA_DEFAULT_CAPACITY ? process.env.MEDIA_DEFAULT_CAPACITY : 0
        const usedSpace = 0
        const maxFileSize = process.env.MEDIA_MAX_SIZE_PER_FILE_IN_MEGABYTES || 1024
        const fileExpirationTime = process.env.MEDIA_FILE_EXPIRATION_TIME_IN_DAYS || 365
        const deleteByLastAccess = true
        const deleteByCreatedAt = false

        await createUserStorage(user, capacity, usedSpace, maxFileSize, fileExpirationTime, deleteByLastAccess, deleteByCreatedAt)
    }

    return true
}

export const createUserStorage = async function (user, capacity, usedSpace, maxFileSize, fileExpirationTime, deleteByLastAccess, deleteByCreatedAt) {
    const doc = new userStorage({
        user, capacity, usedSpace, maxFileSize, fileExpirationTime, deleteByLastAccess, deleteByCreatedAt
    })
    return new Promise(async (resolve, rejects) => {
        try{
            await doc.save()
            winston.info("Media UserStorage createUserStorage for: " + user.username)
            resolve(doc)
        }catch (error) {
            if (error.name == "ValidationError") {
                rejects(new UserInputError(error.message, { inputErrors: error.errors }))
            }
            rejects(error);
        }

    })
}

export const updateUserUsedStorage = async function (userId, size) {
    return new Promise(async (resolve, rejects) => {
        try{
            let r = await  userStorage.findOneAndUpdate({ user: userId },
                { $inc: { usedSpace: size } },
                { runValidators: true, context: "query" })
            resolve(r)
        }catch (error) {
            if (error.name == "ValidationError") {
                rejects(new UserInputError(error.message, { inputErrors: error.errors }))
            }
            rejects(error)
        }

    })
}

export const updateUserStorage = async function (authUser, id, { name, capacity, usedSpace, maxFileSize, fileExpirationTime, deleteByLastAccess, deleteByCreatedAt }) {
    return new Promise(async (resolve, rejects) => {

        try{
            let r = userStorage.findOneAndUpdate({ _id: id },
                { capacity, maxFileSize, fileExpirationTime, deleteByLastAccess, deleteByCreatedAt },
                { runValidators: true, context: "query" })
            resolve(r)
        }catch (error) {
            if (error.name == "ValidationError") {
                rejects(new UserInputError(error.message, { inputErrors: error.errors }))
            }
            rejects(error)
        }

    })
}

export const checkUserStorage = async function (userId, newFileSize) {
    return new Promise(async (resolve, reject) => {

        try{
            let res = await userStorage.findOne({ user: userId }).exec()
            let spaceLeft = res.capacity - res.usedSpace

            if (spaceLeft >= newFileSize) {
                resolve(true)
            } else {
                resolve(false)
            }
        }catch (e) {
            reject(e)
        }

    })
}

export const checkUserStorageLeft = async function (userId) {
    return new Promise(async (resolve, reject) => {

        if (!userId) {
            return resolve(new Error("checkUserStorageLeft: UserId must be provided"))
        }

        try{
            let doc = await userStorage.findOne({ user: userId }).exec()
            if (doc) {
                let storageLeft = doc.capacity - doc.usedSpace
                return resolve(storageLeft)
            } else {
                return resolve(0)
            }
        }catch (e) {
            reject(e)
        }

    })
}
