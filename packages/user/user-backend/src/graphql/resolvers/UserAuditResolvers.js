import {
    fetchUserAuditsFrom,
    fetchUserAuditsLimit
} from '../../services/UserAuditService'
import {AuthenticationError, ForbiddenError} from "apollo-server-express";
import {SECURITY_USER_SHOW} from "../../permissions";

export default {
    Query: {
        userAuditsFrom: (_, {}, {user, rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!user || !rbac.isAllowed(user.id, SECURITY_USER_SHOW)) throw new ForbiddenError("Not Authorized")

            return fetchUserAuditsFrom(30, 'days')
        },
        userAuditsLimit: (_, {}, {user, rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!user || !rbac.isAllowed(user.id, SECURITY_USER_SHOW)) throw new ForbiddenError("Not Authorized")

            return fetchUserAuditsLimit(10)
        },

    },


}

