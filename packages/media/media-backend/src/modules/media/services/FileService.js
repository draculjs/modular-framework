import File from './../models/FileModel'
import {UserInputError} from 'apollo-server-express'

export const findFile = async function (id) {
    return new Promise((resolve, reject) => {
        File.findOne({_id: id}).populate('createdBy.user').exec((err, res) => (
            err ? reject(err) : resolve(res)
        ));
    })
}

export const fetchFiles = async function () {
    return new Promise((resolve, reject) => {
        File.find({}).isDeleted(false).populate('createdBy.user').exec((err, res) => (
            err ? reject(err) : resolve(res)
        ));
    })
}

export const paginateFiles = function ( pageNumber = 1, itemsPerPage = 5, search = null, orderBy = null, orderDesc = false) {

    function qs(search) {
        let qs = {}
        if (search) {
            qs = {
                $or: [
                    {filename: {$regex: search, $options: 'i'}},
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


    let query = {deleted: false, ...qs(search)}
    let populate = ['createdBy.user']
    let sort = getSort(orderBy, orderDesc)
    let params = {page: pageNumber, limit: itemsPerPage, populate, sort}

    return new Promise((resolve, reject) => {
        File.paginate(query, params).then(result => {
                resolve({items: result.docs, totalItems: result.totalDocs, page: result.page})
            }
        ).catch(err => reject(err))
    })
}




export const updateFile = async function (authUser, id, {description, tags}) {
    return new Promise((resolve, rejects) => {
        File.findOneAndUpdate({_id: id},
        {description, tags},
        {new: true, runValidators: true, context: 'query'},
        (error,doc) => {
            
            if (error) {
                if (error.name == "ValidationError") {
                    rejects(new UserInputError(error.message, {inputErrors: error.errors}));
                }
                rejects(error)
            } 
        
            doc.populate('createdBy.user').execPopulate(() => resolve(doc))
        })
    })
}

export const deleteFile = function (id) {
    return new Promise((resolve, rejects) => {
        findFile(id).then((doc) => {
            doc.softdelete(function (err) {
                err ? rejects(err) : resolve({id: id, success: true})
            });
        })
    })
}

