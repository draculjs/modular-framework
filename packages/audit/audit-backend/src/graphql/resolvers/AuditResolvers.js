const {
    findAudit,
    fetchAudit,
    createAudit,
    paginateAudit
} =  require("../../services/AuditService.js");

const {
    AUDIT_SHOW,
} =  require("../../permissions/AuditPermissions.js");

const {AuthenticationError, ForbiddenError} = require("apollo-server-errors");

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
        createAudit: (_, { action, resource, description }, { user }) => {
          if (!user) throw new AuthenticationError("Unauthenticated")
          return createAudit(user, { user: user.id, action, resource, description })
        }
      }
}

module.exports = resolvers;
