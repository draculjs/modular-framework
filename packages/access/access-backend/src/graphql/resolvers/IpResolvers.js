import {
    findIp,
    fetchIp,
    paginateIp,
    fetchEnabledIp,
    createIp,
    updateIp,
    deleteIp
} from '../../services/IpServices'

const {
    IP_CREATE,
    IP_SHOW,
    IP_UPDATE,
    IP_DELETE
} =  require("../../permissions/IpPermissions");

const {AuthenticationError, ForbiddenError} = require("apollo-server-errors");

const resolvers = {
    Query: {
        findIp: async (_, {id}, {user, rbac}) => {
            if(!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, IP_SHOW)) throw new ForbiddenError("Not Authorized")
            return await findIp(id)
        },
        fetchIp: async (_, __, {user, rbac}) => {
            if(!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, IP_SHOW)) throw new ForbiddenError("Not Authorized")
            return await fetchIp()
        },
        paginateIp: async (_, {pageNumber, itemsPerPage, search, orderBy, orderDesc}, {user, rbac}) => {
            if(!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, IP_SHOW)) throw new ForbiddenError("Not Authorized")
            return await paginateIp(pageNumber, itemsPerPage, search, orderBy, orderDesc)
        },
        fetchEnabledIp: async (_, __, {user, rbac}) => {
            if(!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, IP_SHOW)) throw new ForbiddenError("Not Authorized")
            return await fetchEnabledIp()
        },
    },
    Mutation: {
        createIp: async (_, {input}, {user, rbac}) => {
            if(!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, IP_CREATE)) throw new ForbiddenError("Not Authorized")
            return await createIp(input)
        },
        updateIp: async (_, {id, input}, {user, rbac}) => {
            if(!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, IP_UPDATE)) throw new ForbiddenError("Not Authorized")
            return await updateIp(id, input)
        },
        deleteIp: async (_, {id}, {user, rbac}) => {
            if(!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, IP_DELETE)) throw new ForbiddenError("Not Authorized")
            return await deleteIp(id)
        }
    }
}

module.exports = resolvers;
