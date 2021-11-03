import userStorage from "../models/UserStorageModel";
import {UserService} from '@dracul/user-backend';
import ObjectId from 'mongodb'


export const fetchUserStorage = async function () {
    return new Promise(async (resolve, reject) => {
        try{
            let existingUserStorages = await userStorage.find({}).populate('user').exec()
            let users = await UserService.findUsers()
            await checkAndCreate(existingUserStorages, users)
    
            let updatedUserStorages = await userStorage.find({}).populate('user').exec()

            resolve(updatedUserStorages)
        }catch(err){
            reject(err)
        }
    });
  };

const checkAndCreate = async function (existingUserStorages,users) {
    for (let index = 0; index < users.length; index++) {
        if(existingUserStorages.every( x => x.user._id != users[index].id)){
            let user= users[index].id
            let capacity = 0
            await createUserStorage(user, capacity)
        }
    }
    return true
}  

export const createUserStorage = async function (user, capacity) {
    const doc = new userStorage({
        user, capacity
    });
    doc.usedSpace = 0;
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
    console.log("SIZE",typeof size)
    return new Promise((resolve, rejects) => {
        userStorage.findOneAndUpdate({ user: userId },
            { $inc: {usedSpace: size} },
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

export const updateUserStorage = async function (authUser, id, { name, capacity, usedSpace}) {
    
    return new Promise((resolve, rejects) => {
        userStorage.findOneAndUpdate({ _id: id },
        { capacity },
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
        userStorage.findOne({user:userId}).exec((err, res) => {
            if(err){
                reject(err)
            }

            let spaceLeft = res.capacity-res.usedSpace

            if(spaceLeft>=newFileSize){
                resolve(true)
            }else{
                resolve(false)
            }
        })
    });
};

export const checkUserStorageLeft = async function (userId) {
    return new Promise((resolve, reject) => {
        userStorage.findOne({user:userId}).exec((err, res) => {
            if(err){
                reject(err)
            }

            let storageLeft = res.capacity-res.usedSpace
            resolve(storageLeft) 
        })
    });
};