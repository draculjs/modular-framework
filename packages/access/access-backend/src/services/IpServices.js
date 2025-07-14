import Ip from "../models/IpModel.js"

export const findIp = async (id) => {
    try {
        return await Ip.findById(id)
    } catch (error) {
        throw error
    }
}

export const fetchIp = async () => {
    try {
        return await Ip.find({})
    } catch (error) {
        throw error
    }
}

export const paginateIp = async (pageNumber = 1, itemsPerPage = 5, search = null, orderBy = null, orderDesc = false) => {
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

        const {totalDocs: totalItems, docs: items, page} = await Ip.paginate(query, options)
        
        return {totalItems, items, page}
    } catch (error) {
        throw error
    }
}

export const createIp = async (ipData) => {
    try {
        const ip = new Ip(ipData)
        return await ip.save()
    } catch (error) {
        throw error
    }
}

export const updateIp = async (id, data) => {
    try {
        return await Ip.findByIdAndUpdate(id, data, { new: true })
    } catch (error) {
        throw error
    }
}

export const fetchEnabledIp = async () => {
    try {
        const enabledIps = await Ip.find({enable: true})
        return enabledIps.map(ip => ip.value)
    } catch (error) {
        throw error
    }
}

export const deleteIp = async (id) => {
    try {
        return await Ip.findByIdAndDelete(id)
    } catch (error) {
        throw error
    }
}