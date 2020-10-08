import User from '../models/UserModel'
import '../models/GroupModel'
import {createUserAudit} from './UserAuditService'
import bcryptjs from 'bcryptjs'
import {UserInputError} from 'apollo-server-express'
import path from 'path'
import fs from 'fs'
import createDirIfNotExist from "./utils/createDirIfNotExist";

export const hashPassword = function (password) {
    if (!password) {
        throw new Error("password must be provided")
    }

    let salt = bcryptjs.genSaltSync(10);
    let hashPassword = bcryptjs.hashSync(password, salt);
    return hashPassword;
}

export const createUser = async function ({username, password, name, email, phone, role, groups, active}, actionBy = null) {


    const newUser = new User({
        username,
        email,
        password: hashPassword(password),
        name,
        phone,
        active,
        role,
        groups,
        createdAt: Date.now()

    })

    return new Promise((resolve, rejects) => {
        newUser.save((error, doc) => {
            if (error) {
                if (error.name == "ValidationError") {
                    rejects(new UserInputError(error.message, {inputErrors: error.errors}));
                }
                rejects(error)
            } else {
                createUserAudit(actionBy ? actionBy.id : null, doc._id, 'userCreated')
                doc.populate('role').populate('groups').execPopulate(() => (resolve(doc))
                )
            }
        })
    })
}


export const updateUser = async function (id, {username, name, email, phone, role, groups, active}, actionBy = null) {
    let updatedAt = Date.now()

    return new Promise((resolve, rejects) => {
        User.findOneAndUpdate(
            {_id: id}, {username, name, email, phone, role, groups, active, updatedAt}, {
                new: true,
                runValidators: true,
                context: 'query'
            },
            (error, doc) => {
                if (error) {
                    if (error.name == "ValidationError") {
                        rejects(new UserInputError(error.message, {inputErrors: error.errors}));
                    }
                    rejects(error)
                } else {
                    createUserAudit(actionBy ? actionBy.id : null, doc._id, 'userModified')
                    doc.populate('role').populate('groups').execPopulate(() => resolve(doc))
                }
            }
        );
    })
}

export const deleteUser = function (id, actionBy = null) {
    return new Promise((resolve, rejects) => {

        findUser(id).then((doc) => {
            doc.softdelete(function (err) {
                createUserAudit(actionBy ? actionBy.id : null, doc._id, 'userDeleted')
                err ? rejects(err) : resolve({success: true, id: id})
            });
        })

    })
}


export const findUsers = function (roles = []) {

    return new Promise((resolve, reject) => {

        let qs = {}

        if (roles && roles.length) {
            qs.role = {$in: roles}
        }

        User.find(qs).isDeleted(false).populate('role').populate('groups').exec((err, res) => (
            err ? reject(err) : resolve(res)
        ));
    })
}


export const paginateUsers = function (limit, pageNumber = 1, search = null, orderBy = null, orderDesc = false, roles = []) {

    function getQuery(search) {
        let qs = {}

        if (search) {
            qs = {
                $or: [
                    {name: {$regex: search, $options: 'i'}},
                    {username: {$regex: search, $options: 'i'}},
                    {email: {$regex: search, $options: 'i'}},
                    {phone: {$regex: search, $options: 'i'}}
                ]
            }
        }
        if (roles && roles.length) {
            qs.role = {$in: roles}
        }

        return qs
    }

    function getSort(orderBy, orderDesc) {
        if (orderBy) {
            return (orderDesc ? '-' : '') + orderBy
        } else {
            return null
        }
    }


    let query = {deleted: false, ...getQuery(search)}
    let populate = ['role', 'groups']
    let sort = getSort(orderBy, orderDesc)

    let params = {page: pageNumber, limit: limit, populate: populate, sort}
    return new Promise((resolve, reject) => {
        User.paginate(query, params).then(result => {
                resolve({users: result.docs, totalItems: result.totalDocs, page: result.page})
            }
        ).catch(err => reject(err))
    })
}

export const findUser = function (id) {
    return new Promise((resolve, reject) => {
        User.findOne({_id: id}).populate('role').populate('groups').exec((err, res) => (
            err ? reject(err) : resolve(res)
        ));
    })
}

export const findUserByUsername = function (name) {
    return new Promise((resolve, reject) => {
        User.findOne({username: name}).populate('role').populate('groups').exec((err, res) => (
            err ? reject(err) : resolve(res)
        ));
    })
}


export const changePasswordAdmin = function (id, {password, passwordVerify}, actionBy = null) {

    if (password == passwordVerify) {

        return new Promise((resolve, rejects) => {
            User.findOneAndUpdate(
                {_id: id}, {password: hashPassword(password)}, {new: true},
                (error, doc) => {
                    if (error) {
                        rejects({status: false, message: "Falla al intentar modificar password"})
                    } else {
                        createUserAudit(actionBy.id, id, (actionBy.id === id) ? 'userPasswordChange' : 'changePasswordAdmin')
                        resolve({success: true, message: "PasswordChange", operation: "changePasswordAdmin"})
                    }
                }
            );
        })


    } else {
        return new Promise((resolve, rejects) => {
            resolve({status: false, message: "Las password no concuerdan"})
        })
    }
}

export const changePassword = function (id, {currentPassword, newPassword}, actionBy = null) {
    return new Promise(async (resolve, rejects) => {
        let user = await User.findOne({_id: id})
        if (bcryptjs.compareSync(currentPassword, user.password)) {
            User.findOneAndUpdate(
                {_id: id}, {password: hashPassword(newPassword)}, {new: true},
                (error, doc) => {
                    if (error) {
                        rejects(error)
                    } else {
                        createUserAudit(actionBy.id, id, (actionBy.id === id) ? 'userPasswordChange' : 'adminPasswordChange')
                        resolve({status: true, message: "Password Changed"})
                    }
                }
            );
        } else {
            rejects(new UserInputError('auth.wrongPassword',
                {
                    inputErrors: {
                        currentPassword: {properties: {message: 'auth.wrongPassword'}}
                    }
                }));
        }
    })
}


const storeFS = (stream, dst) => {
    return new Promise((resolve, reject) =>
        stream
            .on('error', error => {
                if (stream.truncated)
                    fs.unlinkSync(dst);
                reject(error);
            })
            .pipe(fs.createWriteStream(dst))
            .on('error', error => reject(error))
            .on('finish', () => resolve(true))
    );
}


export const avatarUpload = function (user, file) {


    return new Promise(async (resolve, rejects) => {
        //@TODO validate image size, extension
        const {filename, mimetype, encoding, createReadStream} = await file;

        const parseFileName = path.parse(filename);
        const finalFileName = user.username + parseFileName.ext
        const dst = path.join("media", "avatar", finalFileName)

        //Store
        createDirIfNotExist(dst)
        let fileResult = await storeFS(createReadStream(), dst)

        if (fileResult) {
            const rand = randomstring(3)
            const url = process.env.APP_API_URL + "/media/avatar/" + finalFileName + "?" + rand

            User.findOneAndUpdate(
                {_id: user.id}, {avatar: finalFileName, avatarurl: url}, {useFindAndModify: false},
                (error) => {
                    if (error) {
                        rejects(error)
                    } else {
                        createUserAudit(user.id, user.id, 'avatarChange')
                        resolve({filename, mimetype, encoding, url})
                    }
                }
            );
        } else {
            rejects(new Error("Upload Fail"))
        }

    })

}

function randomstring(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


export const findUsersGroup = function (group) {
    return new Promise((resolve, reject) => {
        User.find({groups: group.id}).then(users => {
            resolve(users)
        }).catch(err => {
            reject(err)
        })
    })
}


export const setUsersGroups = function (group, users) {

    function getDeletePromises(oldUsers) {
        return oldUsers.map((oldUser) => {
            let index = users.indexOf(oldUser.id)
            if (index !== -1) {
                users.splice(index, 1)
            } else {
                // console.log("Deleting user " + oldUser.username + ' for ' + group.id)
                return User.findOneAndUpdate(
                    {_id: oldUser.id},
                    {$pullAll: {groups: [group.id]}},
                    {new: true, runValidators: true, context: 'query'}
                )
            }
        });
    }

    function getPushPromises() {
        return users.map(user => {
            return User.findOneAndUpdate(
                {_id: user},
                {$push: {groups: group.id}},
                {new: true, runValidators: true, context: 'query'},
            )
        });
    }

    return new Promise(async (resolve, reject) => {

        //0. Find actual users with this group
        let oldUsers = await findUsersGroup(group)

        //1. Delete group for old users that doesnt exist anymore
        let deletePromises = getDeletePromises(oldUsers)

        Promise.all(deletePromises).then(() => {

            //2. Push group in new users
            let pushPromises = getPushPromises()

            Promise.all(pushPromises).then(() => {
                resolve(true)
            }).catch(err => reject(err))

        }).catch(err => reject(err))


    })
}
