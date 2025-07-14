import {AuthenticationError, ForbiddenError} from "apollo-server-errors";

import {
    findAudit, fetchAudit, createAudit, paginateAudit
} from "../../services/AuditService.js";

import { AUDIT_SHOW } from "../../permissions/AuditPermissions.js";


export const resolvers = {
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
        createAudit: (_, { action, entity, details, changes, resourceData, resourceName}, { user }) => {
          if (!user) throw new AuthenticationError("Unauthenticated")
          return createAudit(user, {action, entity, details, changes, resourceData, resourceName})
        }
      }
}

export default resolvers;
