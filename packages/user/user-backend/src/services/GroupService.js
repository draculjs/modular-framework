import {DefaultLogger as winston} from '@dracul/logger-backend';
import Group from './../models/GroupModel'
import {UserInputError} from 'apollo-server-express'
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
    return new Promise((resolve, reject) => {
        Group.find({}).isDeleted(false).exec((err, res) => {

            if (err) {
                winston.error("GroupService.fetchGroups ", err)
                reject(err)
            }
            winston.debug("GroupService.fetchGroups successful")
            resolve(res)

        });
    })
}

export const fetchMyGroups = async function (userId) {
    return new Promise((resolve, reject) => {
        Group.find({users: {$in: [userId]}}).isDeleted(false).exec((err, res) => {

            if (err) {
                winston.error("GroupService.fetchMyGroups ", err)
                reject(err)
            }
            winston.debug("GroupService.fetchMyGroups successful")
            resolve(res)

        });
    })
}

export const paginateGroup = function (limit, pageNumber = 1, search = null, orderBy = null, orderDesc = false, includesUser = null) {

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
                    group.users = await findUsersGroup(group)
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
    return new Promise((resolve, reject) => {
        Group.findOne({_id: id}).exec((err, res) => {

            if (err) {
                winston.error("GroupService.findGroup ", err)
                reject(err)
            }

            winston.debug("GroupService.findGroup successful")
            resolve(res)

        });
    })
}

export const findGroupByName = async function (name) {
    return new Promise((resolve, reject) => {
        Group.findOne({name: name}).exec((err, res) => {

            if (err) {
                winston.error("GroupService.findGroupByName ", err)
                reject(err)
            }

            winston.debug("GroupService.findGroupByName successful")
            resolve(res)

        });
    })
}


export const createGroup = async function (user, {name, color, users}) {

    const doc = new Group({
        name, color, users
    })
    doc.id = doc._id;
    return new Promise((resolve, rejects) => {
        doc.save(async error => {

            if (error) {

                if (error.name == "ValidationError") {
                    winston.warn("GroupService.createGroup.ValidationError ", error)
                    rejects(new UserInputError(error.message, {inputErrors: error.errors}));
                }

                winston.error("GroupService.createGroup ", error)

                rejects(error)
            }

            await setUsersGroups(doc, users)
            doc.users = await findUsersGroup(doc)
            winston.info("GroupService.createGroup successful for " + doc.name)
            resolve(doc)
        })
    })
}

export const updateGroup = async function (user, id, {name, color, users = []}) {
    return new Promise((resolve, rejects) => {
        Group.findOneAndUpdate({_id: id},
            {name, color, users},
            {new: true, runValidators: true, context: 'query'},
            async (error, doc) => {

                if (error) {

                    if (error.name == "ValidationError") {
                        winston.warn("GroupService.updateGroup.ValidationError ", error)
                        rejects(new UserInputError(error.message, {inputErrors: error.errors}));
                    }

                    winston.error("GroupService.updateGroup ", error)

                    rejects(error)
                }

                await setUsersGroups(doc, users)
                doc.users = await findUsersGroup(doc)

                winston.info("GroupService.updateGroup successful for " + doc.name)
                resolve(doc)
            })
    })
}

export const deleteGroup = function (id) {
    return new Promise((resolve, rejects) => {
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

