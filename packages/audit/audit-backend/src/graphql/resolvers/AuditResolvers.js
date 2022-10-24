const {
    createAudit,
    updateAudit,
    deleteAudit,
    findAudit,
    fetchAudit,
    paginateAudit
} =  require("../../services/AuditService.js");

const {
    AUDIT_SHOW
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
        
    }
}

module.exports = resolvers;
