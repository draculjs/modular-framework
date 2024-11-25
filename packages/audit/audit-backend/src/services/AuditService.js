import { DefaultLogger as winston } from '@dracul/logger-backend';
import { UserInputError } from 'apollo-server-errors';
import { Audit } from '../models/AuditModel.js';

export async function findAudit(id){
    try{
        const audit = await Audit.findOne({ _id: id }).populate('user').exec()
        return audit
    }catch (error) {
        winston.error('An error happened at the findAudit method', error.message)
    }
}

export async function fetchAudit(){
    try{
        const audit = await Audit.find({ }).populate('user').exec()
        return audit
    }catch (error) {
        winston.error('An error happened at the fetchAudit method', error.message)
    }
}

export function paginateAudit(pageNumber = 1, itemsPerPage = 5, search = null, filters = null, orderBy = null, orderDesc = false) {

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
                    case 'entity':
                        value && (qsFilter.entity = { [operator]: value, $options: "i" })
                        break
                    case 'details':
                        value && (qsFilter.details = { [operator]: value, $options: "i" })
                        break
                }
            })

            return qsFilter
        }
    }

    function getSort(orderBy, orderDesc) {
        return (orderBy) ? (orderDesc ? '-' : '') + orderBy : null
    }

    const populate = [
        { path: 'user', populate: [{ path: 'role' }, { path: 'groups' }] }
    ];
    const sort = getSort(orderBy, orderDesc)

    const query = {
        ...qs(search),
        ...qsFilter(filters)
    }
    const params = { page: pageNumber, limit: itemsPerPage, populate, sort }

    return new Promise((resolve, reject) => {
        Audit.paginate(query, params).then(result => {
            const valueToReturn = { items: result.docs, totalItems: result.totalDocs, page: result.page }
            winston.info(`valueToReturn: ${JSON.stringify(valueToReturn, null , 2)}`)
            resolve(valueToReturn)
        }).catch(err => reject(err))
    })
}


export async function createAudit(authUser, { action, entity, details, changes }) {
    try {
        const doc = new Audit({
            user: authUser.id,
            action,
            entity,
            details,
            changes
        })

        doc.id = doc._id

        const createdAuditory = await doc.save()
        await createdAuditory.populate({ path: 'user' });
        
        return await findAudit(doc.id);
    } catch (error) {
        if (error.name === "ValidationError") {
            throw new UserInputError(error.message, { inputErrors: error.errors })
        }

        throw error
    }
}
