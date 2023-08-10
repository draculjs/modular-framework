import userStorage from "../models/UserStorageModel";
import { UserService } from '@dracul/user-backend';
import { UserInputError } from "apollo-server-errors";
import { DefaultLogger as winston } from '@dracul/logger-backend';


export const fetchUserStorage = async function () {
    try {
        return (await userStorage.find({}).populate('user', ["username"]).exec())
    } catch (error) {
        winston.error(`An error happened at the fetchUserStorage function: ${error}`)
        throw error
    }
}

export const findUserStorageByUser = async function (user) {
    try {
        return (await userStorage.findOne({ user: user.id }).populate('user').exec())
    } catch (error) {
        winston.error(`An error happened at the findUserStorageByUser function: ${error}`)
        throw error
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
    return new Promise((resolve, rejects) => {
        doc.save(((error) => {
            if (error) {
                if (error.name == "ValidationError") {
                    rejects(new UserInputError(error.message, { inputErrors: error.errors }))
                }
                rejects(error);
            }
            winston.info("Media UserStorage createUserStorage for: " + user.username)
            resolve(doc)
        }))
    })
}

export const updateUserUsedStorage = async function (userId, size) {
    return new Promise((resolve, rejects) => {
        userStorage.findOneAndUpdate({ user: userId },
            { $inc: { usedSpace: size } },
            { runValidators: true, context: "query" },
            (error, doc) => {
                if (error) {
                    if (error.name == "ValidationError") {
                        rejects(new UserInputError(error.message, { inputErrors: error.errors }))
                    }
                    rejects(error)
                }
                resolve(doc)
            })
    })
}

export const updateUserStorage = async function (authUser, id, { name, capacity, usedSpace, maxFileSize, fileExpirationTime, deleteByLastAccess, deleteByCreatedAt }) {
    return new Promise((resolve, rejects) => {
        userStorage.findOneAndUpdate({ _id: id },
            { capacity, maxFileSize, fileExpirationTime, deleteByLastAccess, deleteByCreatedAt },
            { runValidators: true, context: "query" },
            (error, doc) => {

                if (error) {
                    if (error.name == "ValidationError") {
                        rejects(new UserInputError(error.message, { inputErrors: error.errors }))
                    }
                    rejects(error)
                }

                resolve(doc)
            })
    })
}

export const checkUserStorage = async function (userId, newFileSize) {
    return new Promise((resolve, reject) => {
        userStorage.findOne({ user: userId }).exec((err, res) => {
            if (err) {
                reject(err)
            }

            let spaceLeft = res.capacity - res.usedSpace

            if (spaceLeft >= newFileSize) {
                resolve(true)
            } else {
                resolve(false)
            }
        })
    })
}

export const checkUserStorageLeft = async function (userId) {
    return new Promise((resolve, reject) => {

        if (!userId) {
            return resolve(new Error("checkUserStorageLeft: UserId must be provided"))
        }

        userStorage.findOne({ user: userId }).exec((err, doc) => {
            if (err) {
                reject(err)
            }

            if (doc) {
                let storageLeft = doc.capacity - doc.usedSpace
                return resolve(storageLeft)
            } else {
                return resolve(0)
            }
        })
    })
}
