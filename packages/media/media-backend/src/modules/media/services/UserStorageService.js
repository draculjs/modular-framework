import userStorage from "../models/UserStorageModel";
import { UserService } from '@dracul/user-backend';
import { UserInputError } from "apollo-server-errors";
import { DefaultLogger as winston } from '@dracul/logger-backend';


export const fetchUserStorage = async function () {
    return new Promise(async (resolve, reject) => {
        try {

            let userStorages = await userStorage.find({}).populate('user').exec()

            resolve(userStorages)
        } catch (err) {
            reject(err)
        }
    });
};

export const findUserStorageByUser = async function (user) {
    return new Promise(async (resolve, reject) => {
        try {
            let doc = await userStorage.findOne({ user: user.id }).populate('user').exec()
            resolve(doc)
        } catch (err) {
            reject(err)
        }
    });
};

export const userStorageCheckAndCreate = async function () {
    winston.info("Media UserStorage running userStorageCheckAndCreate...")
    let userStorages = await userStorage.find({}).populate('user').exec()
    let userStoragesIds = userStorages.map(us => us.user.id)

    let users = await UserService.findUsers()
    let usersWithoutStorage = users.filter(u => !userStoragesIds.includes(u.id))


    for (let user of usersWithoutStorage) {
        let capacity = process.env.MEDIA_DEFAULT_CAPACITY ? process.env.MEDIA_DEFAULT_CAPACITY : 0;
        let usedSpace = 0;
        let maxFileSize = process.env.MEDIA_MAX_SIZE_PER_FILE_IN_MEGABYTES || 1024;
        let fileExpirationTime = process.env.MEDIA_FILE_EXPIRATION_TIME_IN_DAYS || 365;
        let deleteByLastAccess = true;
        let deleteByCreatedAt = false;
        await createUserStorage(user, capacity, usedSpace, maxFileSize, fileExpirationTime, deleteByLastAccess, deleteByCreatedAt)

    }

    return true
}

export const createUserStorage = async function (user, capacity, usedSpace, maxFileSize, fileExpirationTime, deleteByLastAccess, deleteByCreatedAt) {
    const doc = new userStorage({
        user, capacity, usedSpace, maxFileSize, fileExpirationTime, deleteByLastAccess, deleteByCreatedAt
    });
    return new Promise((resolve, rejects) => {
        doc.save(((error) => {
            if (error) {
                if (error.name == "ValidationError") {
                    rejects(new UserInputError(error.message, { inputErrors: error.errors }));
                }
                rejects(error);
            }
            winston.info("Media UserStorage createUserStorage for: " + user.username)
            resolve(doc);
        }));
    });
};

export const updateUserUsedStorage = async function (userId, size) {
    return new Promise((resolve, rejects) => {
        userStorage.findOneAndUpdate({ user: userId },
            { $inc: { usedSpace: size } },
            { runValidators: true, context: "query" },
            (error, doc) => {
                if (error) {
                    if (error.name == "ValidationError") {
                        rejects(new UserInputError(error.message, { inputErrors: error.errors }));
                    }
                    rejects(error);
                }
                resolve(doc);
            });
    });
};

export const updateUserStorage = async function (authUser, id, { name, capacity, usedSpace, maxFileSize, fileExpirationTime, deleteByLastAccess, deleteByCreatedAt }) {
    return new Promise((resolve, rejects) => {
        userStorage.findOneAndUpdate({ _id: id },
            { capacity, maxFileSize, fileExpirationTime, deleteByLastAccess, deleteByCreatedAt },
            { runValidators: true, context: "query" },
            (error, doc) => {

                if (error) {
                    if (error.name == "ValidationError") {
                        rejects(new UserInputError(error.message, { inputErrors: error.errors }));
                    }
                    rejects(error);
                }

                resolve(doc);
            });
    });
};

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
    });
};

export const checkUserStorageLeft = async function (userId) {
    return new Promise((resolve, reject) => {

        if(!userId){
            return  resolve(new Error("checkUserStorageLeft: UserId must be provided"))
        }

        userStorage.findOne({ user: userId }).exec((err, doc) => {
            if (err) {
                reject(err)
            }

            if(doc){
                let storageLeft = doc.capacity - doc.usedSpace
                return resolve(storageLeft)
            }else{
                return resolve(0)
            }
        })
    });
};
