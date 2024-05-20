import {
    findDomain,
    fetchDomain,
    paginateDomain,
    fetchEnabledDomains,
    createDomain,
    updateDomain,
    deleteDomain
} from '../../services/DomainServices'

const {
    DOMAIN_CREATE,
    DOMAIN_SHOW,
    DOMAIN_UPDATE,
    DOMAIN_DELETE
} =  require("../../permissions/DomainPermissions");

const {AuthenticationError, ForbiddenError} = require("apollo-server-errors");

const resolvers = {
    Query: {
        findDomain: async (_, {id}, {user, rbac}) => {
            if(!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, DOMAIN_SHOW)) throw new ForbiddenError("Not Authorized")
            return await findDomain(id)
        },
        fetchDomain: async (_, __, {user, rbac}) => {
            if(!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, DOMAIN_SHOW)) throw new ForbiddenError("Not Authorized")
            return await fetchDomain()
        },
        paginateDomain: async (_, {pageNumber, itemsPerPage, search, orderBy, orderDesc}, {user, rbac}) => {
            if(!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, DOMAIN_SHOW)) throw new ForbiddenError("Not Authorized")
            return await paginateDomain(pageNumber, itemsPerPage, search, orderBy, orderDesc)
        },
        fetchEnabledDomains: async (_, __, {user, rbac}) => {
            if(!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, DOMAIN_SHOW)) throw new ForbiddenError("Not Authorized")
            return await fetchEnabledDomains()
        },
    },
    Mutation: {
        createDomain: async (_, {input}, {user, rbac}) => {
            if(!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, DOMAIN_CREATE)) throw new ForbiddenError("Not Authorized")
            return await createDomain(input)
        },
        updateDomain: async (_, {id, input}, {user, rbac}) => {
            if(!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, DOMAIN_UPDATE)) throw new ForbiddenError("Not Authorized")
            return await updateDomain(id, input)
        },
        deleteDomain: async (_, {id}, {user, rbac}) => {
            if(!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, DOMAIN_DELETE)) throw new ForbiddenError("Not Authorized")
            return await deleteDomain(id)
        }
    }
}

module.exports = resolvers;
