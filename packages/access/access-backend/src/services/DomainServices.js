import Domain from "../models/DomainModel.js"

export const findDomain = async (id) => {
    try {
        return await Domain.findById(id)
    } catch (error) {
        throw error
    }
}

export const fetchDomain = async () => {
    try {
        return await Domain.find({})
    } catch (error) {
        throw error
    }
}

export const paginateDomain = async (pageNumber = 1, itemsPerPage = 5, search = null, orderBy = null, orderDesc = false) => {
    try {
        const options = {
            page: pageNumber,
            limit: itemsPerPage,
            sort: orderBy ? { [orderBy]: orderDesc ? - 1 : 1 } : null
        }

        const query = {}

        if (search){
            query.value = { $regex: search, $options: 'i'  }
        }

        const {totalDocs: totalItems, docs: items, page} = await Domain.paginate(query, options)
        
        return {totalItems, items, page}
    } catch (error) {
        throw error
    }
}

export const createDomain = async (domainData) => {
    try {
        const domain = new Domain(domainData)
        const createdDomain = await domain.save()
        return createdDomain
    } catch (error) {
        throw error
    }
}

export const updateDomain = async (id, domainData) => {
    try {
        return await Domain.findByIdAndUpdate(id, domainData, { new: true })
    } catch (error) {
        throw error
    }
}

export const fetchEnabledDomains = async () => {
    try {
        const enabledDomain = await Domain.find({enable: true})
        return enabledDomain.map(domain => domain.value)
    } catch (error) {
        throw error
    }
}

export const deleteDomain = async (id) => {
    try {
        return await Domain.findByIdAndDelete(id)
    } catch (error) {
        throw error
    }
}