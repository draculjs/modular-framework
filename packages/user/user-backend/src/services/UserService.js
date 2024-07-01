import {DefaultLogger as winston} from '@dracul/logger-backend';

import User from '../models/UserModel'
import '../models/GroupModel'
import {createUserAudit} from './UserAuditService'
import bcryptjs from 'bcryptjs'
import {UserInputError} from 'apollo-server-errors'
import {addUserToGroup, fetchMyGroups, removeUserToGroup} from "./GroupService";
import { findRoleByName, findRoleByNames} from "./RoleService";
import {passwordRules, validateRegexPassword} from "./PasswordService";

const EventEmitter = require('events');

export let UserEventEmitter = new EventEmitter()


export const hashPassword = function (password) {
    if (!password) {
        throw new Error("password must be provided")
    }

    let salt = bcryptjs.genSaltSync(10);
    let hashPassword = bcryptjs.hashSync(password, salt);
    return hashPassword;
}

export const restoreDeletedUser = async function (id, {
    username,
    password,
    name,
    email,
    phone,
    role,
    groups,
    active,
    refreshToken
}, actionBy = null) {

    try {
        winston.info('UserService.restoreDeletedUser restoring id: ' + id + ' username: ' + username)

        let updatedAt = Date.now()

        //Prepare group push and pull
        let toRemoveGroups = []
        let toAddGroups = []
        let oldGroups = await fetchMyGroups(id)
        if (oldGroups && oldGroups.length) {
            toRemoveGroups = oldGroups.filter(group => !groups.some(ngroup => ngroup.id === group.id))
        }
        if (groups && groups.length) {
            toAddGroups = groups.filter(group => !oldGroups.some(ngroup => ngroup.id === group.id))
        }

        const user = User.findOneAndUpdate(
            {_id: id},
            {
                name: name.trim(),
                username: username.trim(),
                email: email.trim(),
                password: hashPassword(password),
                phone, role, groups, active, updatedAt, refreshToken,
                deleted: false, deletedAt: null
            }, {
                new: true,
                runValidators: true,
                context: 'query'
            }).exec()

        //Add user to groups
        //console.log("toAddGroups", toAddGroups)
        if (toAddGroups && toAddGroups.length) {
            for (let groupId of toAddGroups) {
                await addUserToGroup(groupId, user._id)
            }
        }

        //Remove user to groups
        //console.log("toRemoveGroups", toRemoveGroups)
        if (toRemoveGroups && toRemoveGroups.length) {
            for (let group of toRemoveGroups) {
                await removeUserToGroup(group.id, user._id)
            }
        }

        winston.info('UserService.restoreDeletedUser successful for ' + user.username)
        await createUserAudit(actionBy ? actionBy.id : null, user._id, 'userRestored')

        await user.populate(['role','groups'])
        UserEventEmitter.emit('updated', user)
        return user

    } catch (error) {
        if (error.name == "ValidationError") {
            winston.warn("updateUser ValidationError ", error)
            throw new UserInputError(error.message, {inputErrors: error.errors})
        }
        winston.error("UserService.updateUser ", error)
        throw error
    }

}


export const createUser = async function ({
                                              username,
                                              password,
                                              name,
                                              email,
                                              phone,
                                              role,
                                              groups,
                                              active,
                                              fromLDAP = false
                                          }, actionBy = null) {
    const existingUser = await findUserByUsernameOrEmailDeleted(username, email)

    if (existingUser) {
        return restoreDeletedUser(existingUser._id, {
            username,
            password,
            name,
            email,
            phone,
            role,
            groups,
            active,
            fromLDAP
        }, actionBy = null)
    }

    if (validateRegexPassword(password) === false) {
        return Promise.reject(new UserInputError('auth.invalidPassword', {
            inputErrors: {
                password: {properties: {message: passwordRules.requirements}}
            }
        }))
    }

    const newUser = new User({
        name: name.trim(),
        username: username.trim(),
        email: email.trim(),
        password: hashPassword(password),
        phone,
        active,
        role,
        groups,
        createdAt: Date.now(),
        lastPasswordChange: new Date(),
        refreshToken: [],
        fromLDAP
    })

    try {
        await newUser.save()

        if (groups && groups.length) {
            for (let group of groups) {
                await addUserToGroup(group, newUser._id)
            }
        }

        winston.info('UserService.createUser successful for ' + newUser.username)
        await createUserAudit(actionBy ? actionBy.id : null, newUser._id, 'userCreated')

        await newUser.populate(['role','groups'])
        UserEventEmitter.emit('created', newUser)
        return newUser

    } catch (error) {
        if (error.name == "ValidationError") {
            winston.warn("createUser ValidationError ", error)
            throw new UserInputError(error.message, {inputErrors: error.errors})
        } else {
            winston.error("UserService.createUser ", error)
        }
        throw e
    }

}


export const updateUser = async function (id, {
    username,
    name,
    email,
    phone,
    role,
    groups,
    active,
    refreshToken
}, actionBy = null) {

    try {
        let updatedAt = Date.now()

        //Prepare group push and pull
        let toRemoveGroups = []
        let toAddGroups = []
        let oldGroups = await fetchMyGroups(id)
        if (oldGroups && oldGroups.length) {
            toRemoveGroups = oldGroups.filter(group => !groups.some(ngroup => ngroup.id === group.id))
        }
        if (groups && groups.length) {
            toAddGroups = groups.filter(group => !oldGroups.some(ngroup => ngroup.id === group.id))
        }

        const user = await User.findOneAndUpdate(
            {_id: id},
            {
                name: name.trim(),
                username: username.trim(),
                email: email.trim(),
                phone, role, groups, active, updatedAt, refreshToken
            }, {
                new: true,
                runValidators: true,
                context: 'query'
            }).exec()

        //Add user to groups
        //console.log("toAddGroups", toAddGroups)
        if (toAddGroups && toAddGroups.length) {
            for (let groupId of toAddGroups) {
                await addUserToGroup(groupId, user._id)
            }
        }

        //Remove user to groups
        //console.log("toRemoveGroups", toRemoveGroups)
        if (toRemoveGroups && toRemoveGroups.length) {
            for (let group of toRemoveGroups) {
                await removeUserToGroup(group.id, user._id)
            }
        }


        winston.info('UserService.updateUser successful for ' + user.username)
        await createUserAudit(actionBy ? actionBy.id : null, user._id, 'userModified')
        await user.populate(['role','groups'])
        UserEventEmitter.emit('updated', user)
        return user


    } catch (error) {
        if (error.name == "ValidationError") {
            winston.warn("updateUser ValidationError ", error)
            throw new UserInputError(error.message, {inputErrors: error.errors});
        } else {
            winston.error("UserService.updateUser ", error)
        }

        throw error
    }


}

export const deleteUser = async function (id, actionBy = null) {
    try{
        const user = await findUser(id)
        await user.softdelete()
        await createUserAudit(actionBy ? actionBy.id : null, user._id, 'userDeleted')
        UserEventEmitter.emit('deleted', user)
        return {success: true, id: id}
    }catch (e) {
        winston.error("UserService.deleteUser ", e)
        throw e
    }
}


export const findUsers = async function (roles = [], userId = null) {

    try {
        let qs = {}

        if (roles && roles.length) {
            qs = {
                $or: [
                    {role: {$in: roles}},
                    {_id: userId}
                ]
            }
        }

        const users = await User.find(qs).isDeleted(false).populate(['role','groups']).exec()
        return users
    } catch (e) {
        winston.error("UserService.findUsers ", e)
        throw e
    }

}


export const findUsersByRole = async function (roleName) {

    try {
        let role = await findRoleByName(roleName)

        if (!role) return resolve([])

        const users = await User.find({role: role.id}).isDeleted(false).populate(['role','groups']).exec()

        return users
    } catch (e) {
        winston.error("UserService.findUsersByRole ", e)
        throw e
    }


}

export const findUsersByRoles = async function (roleNames) {
    try {
        let roles = await findRoleByNames(roleNames)
        if (!roles && roles.length === 0) return resolve([])
        const users = await User.find({role: {$in: roles.map(r => r._id)}}).isDeleted(false).populate(['role','groups']).exec()
        return users
    } catch (e) {
        winston.error("UserService.findUsersByRole ", e)
        throw e
    }
}


export const paginateUsers = function (limit, pageNumber = 1, search = null, orderBy = null, orderDesc = false, roles = [], activeUsers = false) {

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

        if (activeUsers) {
            qs.active = true
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
                winston.debug('UserService.paginateUsers successful')
                resolve({users: result.docs, totalItems: result.totalDocs, page: result.page})
            }
        ).catch(err => {
            winston.error("UserService.paginateUsers ", err)
            reject(err)
        })
    })
}

export const findUser = async function (id) {
    try {
        const user = await User.findOne({_id: id}).populate(['role','groups']).exec()
        return user
    } catch (e) {
        winston.error("UserService.findUser ", e)
        throw e
    }
}

export const findUserByUsername = async function (username) {
    try {
        const user = await User.findOne({username: username}).populate(['role','groups']).exec()
        return user
    } catch (e) {
        winston.error("UserService.findUserByUsername ", e)
        throw e
    }
}

export const findUserByEmail = async function (email) {

    try {
        const user = await User.findOne({email: email}).populate(['role','groups']).exec()
        return user
    } catch (e) {
        winston.error("UserService.findUserByEmail ", e)
        throw e
    }


}

export const findUserByUsernameOrEmail = async function (username, email) {
    try {
        const user = await User.findOne({$or: [{username: username}, {email: email}]}).populate(['role','groups']).exec()
        return user
    } catch (e) {
        winston.error("UserService.findUserByEmail ", e)
        throw e
    }
}

export const findUserByUsernameOrEmailDeleted = async function (username, email) {

    try {
        const user = await User.findOne({
            $or: [{username: username}, {email: email}],
            deleted: true
        }).populate(['role','groups']).exec()

        return user
    } catch (e) {
        winston.error("UserService.findUserByUsernameOrEmailDeleted ", e)
        throw e
    }
}


export const changePasswordAdmin = async function (id, {password, passwordVerify}, actionBy = null) {

    if (password !== passwordVerify) {
        throw new Error("Passwords do not match")
    }

    try {
        if (validateRegexPassword(password) === false) {
            throw new UserInputError('auth.invalidPassword', {
                inputErrors: {
                    password: {properties: {message: passwordRules.requirements}}
                }
            })
        }

        const user = await User.findOneAndUpdate({_id: id}, {
            password: hashPassword(password),
            lastPasswordChange: new Date()
        }, {new: true})
        await createUserAudit(actionBy.id, id, (actionBy.id === id) ? 'userPasswordChange' : 'changePasswordAdmin')
        return {success: true, message: "PasswordChange", operation: "changePasswordAdmin"}


    } catch (e) {
        winston.error("UserService.changePasswordAdmin ", e)
        throw e
    }

}


export const findUsersGroup = async function (group, showDeletedUsers) {
    try {
        return (await User.find({groups: group.id, deleted: showDeletedUsers}))
    } catch (error) {
        winston.error("UserService.findUsersGroup ", error)
    }
}


export const setUsersGroups = async function (group, users) {

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
                ).exec()

            }
        });
    }

    function getPushPromises() {
        return users.map( (user) => {
            return User.findOneAndUpdate(
                {_id: user},
                {$push: {groups: group.id}},
                {new: true, runValidators: true, context: 'query'},
            ).exec()
        });
    }

    return new Promise(async (resolve, reject) => {


        findUsersGroup(group).then(oldUsers => {

            Promise.all(getDeletePromises(oldUsers)).then(() => {

                //2. Push group in new users
                let pushPromises = getPushPromises()

                Promise.all(pushPromises).then(() => {
                    winston.debug('UserService.setUsersGroups successful')
                    resolve(true)
                }).catch(err => reject(err))

            }).catch(err => {
                    winston.error("UserService.setUsersGroups ", err)
                    reject(err)
                }
            )

        }).catch(e => {

            winston.error("UserService.setUsersGroups.findUsersGroup ", e)
            reject(e)
        })

    })
}

export const findUserByRefreshToken = async function (id) {

    try {
        let now = new Date()
        const user = await User.findOne({
            active: true,
            'refreshToken.id': id,
            'refreshToken.expiryDate': {$gte: now}
        }).populate(['role','groups']).exec()
        return user
    } catch (e) {
        winston.error("UserService.findUserByRefreshToken ", e)
        throw e
    }

}
