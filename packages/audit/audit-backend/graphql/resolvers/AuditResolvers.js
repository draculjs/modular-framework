const {
    createAudit,
    updateAudit,
    deleteAudit,
    findAudit,
    fetchAudit,
    paginateAudit
} =  require('../../services/AuditService.js');

const {
    AUDIT_SHOW,
    AUDIT_UPDATE,
    AUDIT_CREATE,
    AUDIT_DELETE
} =  require("../../permissions/AuditPermissions.js");

const {AuthenticationError, ForbiddenError} = require("apollo-server-express");

const resolvers = {
    Query: {
        findAudit: (_, {id}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, AUDIT_SHOW)) throw new ForbiddenError("Not Authorized")
            return findAudit(id)
        },
        fetchAudit: (_, {}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, AUDIT_SHOW)) throw new ForbiddenError("Not Authorized")
            return fetchAudit()
        },
        paginateAudit: (_, {pageNumber, itemsPerPage, search, filters, orderBy, orderDesc}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, AUDIT_SHOW)) throw new ForbiddenError("Not Authorized")
            return paginateAudit(pageNumber, itemsPerPage, search, filters, orderBy, orderDesc)
        },
        
    },
    Mutation: {
        createAudit: (_, {input}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, AUDIT_CREATE)) throw new ForbiddenError("Not Authorized")
            return createAudit(user, input)
        },
        updateAudit: (_, {id, input}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, AUDIT_UPDATE)) throw new ForbiddenError("Not Authorized")
            return updateAudit(user, id, input)
        },
        deleteAudit: (_, {id}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, AUDIT_DELETE)) throw new ForbiddenError("Not Authorized")
            return deleteAudit(id)
        },
    }

}

module.exports = resolvers;
