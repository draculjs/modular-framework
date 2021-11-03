import userStorage from "../models/UserStorageModel";
import { UserService } from '@dracul/user-backend';
import ObjectId from 'mongodb'


export const fetchUserStorage = async function () {
    return new Promise(async (resolve, reject) => {
        try {
            let existingUserStorages = await userStorage.find({}).populate('user').exec()
            let users = await UserService.findUsers()
            await checkAndCreate(existingUserStorages, users)

            let updatedUserStorages = await userStorage.find({}).populate('user').exec()

            resolve(updatedUserStorages)
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

const checkAndCreate = async function (existingUserStorages, users) {
    for (let index = 0; index < users.length; index++) {
        if (existingUserStorages.every(x => x.user._id != users[index].id)) {
            let user = users[index].id;
            let capacity = 0;
            let usedSpace = 0;
            let maxFileSize = process.env.MAX_SIZE_PER_FILE_IN_MEGABYTES;
            await createUserStorage(user, capacity, usedSpace, maxFileSize)
        }
    }
    return true
}

export const createUserStorage = async function (user, capacity, usedSpace, maxFileSize) {
    const doc = new userStorage({
        user, capacity, usedSpace, maxFileSize
    });
    return new Promise((resolve, rejects) => {
        doc.save(((error) => {
            if (error) {
                if (error.name == "ValidationError") {
                    rejects(new UserInputError(error.message, { inputErrors: error.errors }));
                }
                rejects(error);
            }

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

export const updateUserStorage = async function (authUser, id, { name, capacity, usedSpace, maxFileSize }) {
    return new Promise((resolve, rejects) => {
        userStorage.findOneAndUpdate({ _id: id },
            { capacity, maxFileSize },
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
        userStorage.findOne({ user: userId }).exec((err, res) => {
            if (err) {
                reject(err)
            }

            let storageLeft = res.capacity - res.usedSpace
            resolve(storageLeft)
        })
    });
};