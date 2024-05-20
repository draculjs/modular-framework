import {DefaultLogger as winston} from '@dracul/logger-backend';
import Group from './../models/GroupModel'
import {UserInputError} from 'apollo-server-errors'
import {findUsersGroup, setUsersGroups} from "./UserService";


export const addUserToGroup = function (groupId, userId) {
    return Group.findByIdAndUpdate(
        groupId,
        {$push: {users: userId}},
        {new: true, useFindAndModify: false}
    );
};

export const removeUserToGroup = function (groupId, userId) {
    return Group.findByIdAndUpdate(
        groupId,
        {$pull: {users: userId}},
        {new: true, useFindAndModify: false}
    );
};


export const fetchGroups = async function () {

    try {
        const groups = await Group.find({}).isDeleted(false).populate('users').exec()
        return groups
    } catch (e) {
        winston.error("GroupService.fetchGroups ", e)
        throw e
    }
}

export const fetchMyGroups = async function (userId) {

    try {
        const groups = await Group.find({users: {$in: [userId]}}).isDeleted(false).populate('users').exec()
        return groups
    } catch (e) {
        winston.error("GroupService.fetchMyGroups ", e)
        throw e
    }

}

export const paginateGroup = function (limit, pageNumber = 1, search = null, orderBy = null, orderDesc = false, includesUser = null, showDeletedUsers = true) {

    function qs(search, includesUser) {
        let qs = {}
        let or = []

        if (includesUser) {
            or.push({users: {$in: [includesUser]}})
        }

        if (search) {
            or.push({name: {$regex: search, $options: 'i'}})
        }

        if (search || includesUser) {
            qs = {
                $or: or
            }
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


    let query = {deleted: false, ...qs(search, includesUser)}
    let populate = null
    let sort = getSort(orderBy, orderDesc)
    let params = {page: pageNumber, limit: limit, populate, sort}

    return new Promise((resolve, reject) => {
        Group.paginate(query, params).then(result => {
                let docs = result.docs.map(async group => {
                    group.users = await findUsersGroup(group, showDeletedUsers)
                    return group
                })

                winston.debug("GroupService.paginateGroup successful")
                resolve({items: docs, totalItems: result.totalDocs, page: result.page})
            }
        ).catch(err => {
            winston.error("GroupService.paginateGroup ", err)
            reject(err)
        })
    })
}

export const findGroup = async function (id) {

    try {
        const group = await Group.findOne({_id: id}).populate('users').exec()
        return group
    } catch (e) {
        winston.error("GroupService.findGroup ", e)
        throw e
    }

}

export const findGroupByName = async function (name) {

    try {
        const group = await Group.findOne({name: {$eq: name}}).isDeleted(false).populate('users').exec()
        if(group && Array.isArray(group) && group.length > 0) {
            return group[0]
        }
        return group
    } catch (e) {
        winston.error("GroupService.findGroupByName ", e)
        throw e
    }
}


export const createGroup = async function (user, {name, color, users}) {

    try {
        if (await findGroupByName(name)) {
            throw new UserInputError('Group validation fail', {
                inputErrors: {
                    name: {
                        name: "ValidatorError", message: "validation.unique",
                        properties: {message: "validation.unique", type: "unique", path: "name", value: name}
                    }
                }
            })
        }

        const group = new Group({
            name, color, users
        })
        group.id = group._id;

        await setUsersGroups(group, users)
        group.users = await findUsersGroup(group)

        return group

    } catch (error) {
        if (error.name == "ValidationError") {
            winston.warn("GroupService.createGroup.ValidationError ", error)
            throw new UserInputError(error.message, {inputErrors: error.errors})
        }

        winston.error("GroupService.createGroup ", error)
        throw error
    }
}

export const updateGroup = async function (user, id, {name, color, users = []}) {

    try{
        let ge = await findGroupByName(name)

        if (ge && ge._id.toString() != id) {
            throw new UserInputError('Group validation fail', {
                inputErrors: {
                    name: {
                        name: "ValidatorError", message: "validation.unique",
                        properties: {message: "validation.unique", type: "unique", path: "name", value: name}
                    }
                }
            })
        }

        const group = await  Group.findOneAndUpdate({_id: id},
            {name, color, users},
            {new: true, runValidators: true, context: 'query'}).exec()
        await setUsersGroups(group, users)
        group.users = await findUsersGroup(group)
        return group
    }catch (error) {
        if (error.name == "ValidationError") {
            winston.warn("GroupService.updateGroup.ValidationError ", error)
            throw new UserInputError(error.message, {inputErrors: error.errors})
        }

        winston.error("GroupService.updateGroup ", error)
        throw error
    }

}

export const deleteGroup = function (id) {
    return new Promise((resolve, reject) => {
        findGroup(id).then((doc) => {
            doc.softdelete(function (err) {

                if (err) {
                    winston.error("GroupService.deleteGroup ", err)
                    reject(err)
                }

                winston.info("GroupService.deleteGroup successful for " + doc.name)
                resolve({id: id, deleteSuccess: true})

            });
        })
    })
}

