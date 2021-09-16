import {QueueModel} from '@dracul/mongoose-queue'
import {UserInputError} from 'apollo-server-express'

export const findQueue = async function (id) {
    return new Promise((resolve, reject) => {
        QueueModel.findOne({_id: id}).exec((err, res) => (
            err ? reject(err) : resolve(res)
        ));
    })
}

export const fetchQueues = async function () {
    return new Promise((resolve, reject) => {
        QueueModel.find({}).exec((err, res) => (
            err ? reject(err) : resolve(res)
        ));
    })
}

export const paginateQueues = function ( pageNumber = 1, itemsPerPage = 5, search = null, orderBy = null, orderDesc = false) {

    function qs(search) {
        let qs = {}
        if (search) {
            qs = {
                $or: [

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

    let query = qs(search)
    let populate = null
    let sort = getSort(orderBy, orderDesc)
    let params = {page: pageNumber, limit: itemsPerPage, populate, sort}

    return new Promise((resolve, reject) => {
        QueueModel.paginate(query, params).then(result => {
                resolve({items: result.docs, totalItems: result.totalDocs, page: result.page})
            }
        ).catch(err => reject(err))
    })
}





export const createQueue = async function (authUser, {blockedUntil, workerId, maxRetries, retries, progress, progressDetail, state, topic, payload, done, error}) {

    const doc = new QueueModel({
        blockedUntil, workerId, maxRetries, retries, progress, progressDetail, state, topic, payload, done, error
    })
    doc.id = doc._id;
    return new Promise((resolve, rejects) => {
        doc.save((error => {

            if (error) {
                if (error.name == "ValidationError") {
                    return rejects(new UserInputError(error.message, {inputErrors: error.errors}));
                }
                return rejects(error)
            }

            resolve(doc)
        }))
    })
}

export const updateQueue = async function (authUser, id, {blockedUntil, workerId, maxRetries, retries, progress, progressDetail, state, topic, payload, done, error}) {
    return new Promise((resolve, rejects) => {
        QueueModel.findOneAndUpdate({_id: id},
        {blockedUntil, workerId, maxRetries, retries, progress, progressDetail, state, topic, payload, done, error},
        {new: true, runValidators: true, context: 'query'},
        (error,doc) => {

            if (error) {
                if (error.name == "ValidationError") {
                 return rejects(new UserInputError(error.message, {inputErrors: error.errors}));

                }
                return rejects(error)

            }

            resolve(doc)
        })
    })
}

export const deleteQueue = function (id) {
    return new Promise((resolve, rejects) => {
        findQueue(id).then((doc) => {
            doc.delete(function (err) {
                err ? rejects(err) : resolve({id: id, success: true})
            });
        })
    })
}

