import {
    sessionsByCity, sessionsByClient,
    sessionsByCountry,
    sessionsByDeviceType,
    sessionsByOs,
    sessionsByUser
} from '../../services/SessionService'
import {AuthenticationError, ForbiddenError} from "apollo-server-express";
import {SECURITY_USER_SHOW} from "../../permissions";

export default {
    Query: {
        sessionsByUser: (_, {}, {user, rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!user || !rbac.isAllowed(user.id, SECURITY_USER_SHOW)) throw new ForbiddenError("Not Authorized")
            return sessionsByUser(30, 'days')
        },
        sessionsByCountry: (_, {}, {user, rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!user || !rbac.isAllowed(user.id, SECURITY_USER_SHOW)) throw new ForbiddenError("Not Authorized")
            return sessionsByCountry(30, 'days')
        },
        sessionsByOs: (_, {}, {user, rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!user || !rbac.isAllowed(user.id, SECURITY_USER_SHOW)) throw new ForbiddenError("Not Authorized")
            return sessionsByOs(30, 'days')
        },
        sessionsByDeviceType: (_, {}, {user, rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!user || !rbac.isAllowed(user.id, SECURITY_USER_SHOW)) throw new ForbiddenError("Not Authorized")
            return sessionsByDeviceType(30, 'days')
        },
        sessionsByCity: (_, {}, {user, rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!user || !rbac.isAllowed(user.id, SECURITY_USER_SHOW)) throw new ForbiddenError("Not Authorized")
            return sessionsByCity(30, 'days')
        },
        sessionsByClient: (_, {}, {user, rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!user || !rbac.isAllowed(user.id, SECURITY_USER_SHOW)) throw new ForbiddenError("Not Authorized")
            return sessionsByClient(30, 'days')
        },
    },


}

