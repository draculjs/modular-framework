import File from './../models/FileModel'
import { UserInputError } from 'apollo-server-express'
import { FILE_SHOW_OWN, FILE_UPDATE_OWN, FILE_DELETE_OWN } from "../../media/permissions/File";
import { updateUserUsedStorage } from './UserStorageService';

export const findFile = async function (id, permissionType = null, userId = null) {

    if (id) {
        return new Promise((resolve, reject) => {
            File.findOne({ _id: id, ...filterByFileOwner(permissionType, userId) }).populate('createdBy.user').exec((err, res) => (
                err ? reject(err) : resolve(res)
            ));
        })
    } else {
        throw new Error({ message: 'id field is required' })
    }
}

export const fetchFiles = async function () {
    return new Promise((resolve, reject) => {
        File.find({}).isDeleted(false).populate('createdBy.user').exec((err, res) => (
            err ? reject(err) : resolve(res)
        ));
    })
}

export const paginateFiles = function (pageNumber = 1, itemsPerPage = 5, search = null, orderBy = null, orderDesc = false, permissionType = null, userId = null) {

    function qs(search) {
        let qs = {}
        if (search) {
            qs = {
                $or: [
                    { filename: { $regex: search, $options: 'i' } },
                ]
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

    let query = { deleted: false, ...qs(search), ...filterByFileOwner(permissionType, userId) }
    let populate = ['createdBy.user']
    let sort = getSort(orderBy, orderDesc)
    let params = { page: pageNumber, limit: itemsPerPage, populate, sort }

    return new Promise((resolve, reject) => {
        File.paginate(query, params).then(result => {
            resolve({ items: result.docs, totalItems: result.totalDocs, page: result.page })
        }
        ).catch(err => reject(err))
    })
}




export const updateFile = async function (authUser, id, { description, tags }, permissionType, userId) {
    return new Promise((resolve, rejects) => {
        File.findOneAndUpdate({ _id: id, ...filterByFileOwner(permissionType, userId) },
            { description, tags },
            { new: true, runValidators: true, context: 'query' },
            (error, doc) => {

                if (error) {
                    if (error.name == "ValidationError") {
                        rejects(new UserInputError(error.message, { inputErrors: error.errors }));
                    }
                    rejects(error)
                }
                if (doc) {
                    doc.populate('createdBy.user').execPopulate(() => resolve(doc))
                } else {
                    rejects('File not found')
                }
            })
    })
}

export const deleteFile = function (id, permissionType, userId) {

    return new Promise((resolve, rejects) => {
        findFile(id, permissionType, userId).then((doc) => {
            if (doc) {  
                updateUserUsedStorage(userId, -doc.size)

                doc.softdelete(function (err) {
                    err ? rejects(err) : resolve({ id: id, success: true })
                });
            } else {
                rejects('File not found')
            }
        })
    })
}

function filterByFileOwner(permissionType, userId) {
    let query;
    switch (permissionType) {
        // Si el user es dueño del archivo (o es admin), puede encontrarlo, actualizarlo o borrarlo
        case FILE_SHOW_OWN:
        case FILE_UPDATE_OWN:
        case FILE_DELETE_OWN:
            query = { 'createdBy.user': userId }
            break;
        default:
            break;
    }
    return query;
}

