const Audit = require('../models/AuditModel.js')
const { UserInputError } = require('apollo-server-errors')

const findAudit = async function (id) {
    return new Promise((resolve, reject) => {
        Audit.findOne({ _id: id }).populate('user').exec((err, res) => (
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

const paginateAudit = function (pageNumber = 1, itemsPerPage = 5, search = null, filters = null, orderBy = null, orderDesc = false) {

    function qs(search, filters) {
        let qs = {}

        if (search) {
            qs = {
                $or: [
                    {action: {$regex: search, $options: 'i'}},
                ]
            }
        }

        return qs
    }

    function qsFilter(filters) {
        if (filters) {
            const qsFilter = {}

            filters.forEach(({ field, operator, value }) => {
                switch (field) {
                    case 'user':
                        (value) && (qsFilter.user = { [operator]: value })
                        break
                    case 'action':
                        (value) && (qsFilter.action = { [operator]: value, $options: "i" })
                        break
                    case 'resource':
                        value && (qsFilter.resource = { [operator]: value, $options: "i" })
                        break
                }
            })

            return qsFilter
        }
    }

    function getSort(orderBy, orderDesc) {
        return (orderBy) ? (orderDesc ? '-' : '') + orderBy : null
    }

    const populate = ['user']
    const sort = getSort(orderBy, orderDesc)

    const query = {
        ...qs(search),
        ...qsFilter(filters)
    }
    const params = { page: pageNumber, limit: itemsPerPage, populate, sort }

    return new Promise((resolve, reject) => {
        Audit.paginate(query, params).then(result => {
            resolve({ items: result.docs, totalItems: result.totalDocs, page: result.page })
        }).catch(err => reject(err))
    })
}

const createAudit = async function (authUser, { user, action, resource, description }) {

    const doc = new Audit({
        user, action, resource, description
    })

    doc.id = doc._id

    return new Promise((resolve, rejects) => {
        doc.save((error => {

            if (error) {
                if (error.name == "ValidationError") {
                    return rejects(new UserInputError(error.message, { inputErrors: error.errors }));
                }
                return rejects(error)
            }

            doc.populate('user').execPopulate(() => resolve(doc))
        }))
    })
}

module.exports = {
    createAudit, fetchAudit, paginateAudit, findAudit
}
