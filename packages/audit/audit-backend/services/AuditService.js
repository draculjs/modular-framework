const Audit = require('../models/AuditModel.js')
const {UserInputError} = require('apollo-server-express')

const findAudit = async function (id) {
    return new Promise((resolve, reject) => {
        Audit.findOne({_id: id}).populate('user').exec((err, res) => (
            err ? reject(err) : resolve(res)
        ));
    })
}

const fetchAudit = async function () {
    return new Promise((resolve, reject) => {
        Audit.find({}).populate('user').exec((err, res) => (
            err ? reject(err) : resolve(res)
        ));
    })
}

const paginateAudit = function ( pageNumber = 1, itemsPerPage = 5, search = null, filters = null, orderBy = null, orderDesc = false) {

    function qs(search, filters) {
        let qs = {}
        if (search) {
            qs = {
                $or: [
                    
                ]
            }
        }
        
        if(filters){
        
            filters.forEach(filter => {
                switch(filter.operator){
                    case '=':
                    case 'eq':
                        qs[filter.field] = {...qs[filter.field], $eq: filter.value}
                        break;
                    case 'contain':
                    case 'regex':
                        qs[filter.field] = {...qs[filter.field], $regex: filter.value}
                        break;
                    case '>':
                    case 'gt':
                        qs[filter.field] = {...qs[filter.field], $gt: filter.value}
                        break;    
                    case '<':
                    case 'lt':
                        qs[filter.field] = {...qs[filter.field], $lt: filter.value}
                        break;    
                    case '>=':
                    case 'gte':
                        qs[filter.field] = {...qs[filter.field], $gte: filter.value}
                        break;    
                    case '<=':
                    case 'lte':
                        qs[filter.field] = {...qs[filter.field], $lte: filter.value}
                        break;          
                    default:
                        qs[filter.field] = {...qs[filter.field], $eq: filter.value}
                }
            })
        
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

    let query = qs(search, filters)
    let populate = ['user']
    let sort = getSort(orderBy, orderDesc)
    let params = {page: pageNumber, limit: itemsPerPage, populate, sort}

    return new Promise((resolve, reject) => {
        Audit.paginate(query, params).then(result => {
                resolve({items: result.docs, totalItems: result.totalDocs, page: result.page})
            }
        ).catch(err => reject(err))
    })
}





const createAudit = async function (authUser, {user, action, target}) {
    
    const doc = new Audit({
        user, action, target
    })

    doc.id = doc._id
    
    return new Promise((resolve, rejects) => {
        doc.save((error => {
        
            if (error) {
                if (error.name == "ValidationError") {
                    return rejects(new UserInputError(error.message, {inputErrors: error.errors}));
                }
                return rejects(error)
            }    
        
            doc.populate('user').execPopulate(() => resolve(doc))
        }))
    })
}

const updateAudit = async function (authUser, id, {user, action, target}) {
    return new Promise((resolve, rejects) => {
        Audit.findOneAndUpdate({_id: id},
        {user, action, target}, 
        {new: true, runValidators: true, context: 'query'},
        (error,doc) => {
            
            if (error) {
                if (error.name == "ValidationError") {
                 return rejects(new UserInputError(error.message, {inputErrors: error.errors}));
                
                }
                return rejects(error)
                
            } 
        
            doc.populate('user').execPopulate(() => resolve(doc))
        })
    })
}

const deleteAudit = function (id) {
    return new Promise((resolve, rejects) => {
        findAudit(id).then((doc) => {
            doc.delete(function (err) {
                err ? rejects(err) : resolve({id: id, success: true})
            });
        })
    })
}

module.exports = {
    createAudit, fetchAudit, updateAudit, deleteAudit, paginateAudit, findAudit
}
