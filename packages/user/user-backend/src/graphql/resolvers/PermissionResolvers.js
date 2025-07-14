import {AuthenticationError, ForbiddenError} from "apollo-server-errors";
import {SECURITY_ROLE_SHOW, SECURITY_ROLE_SHOW_CHILD} from "../../permissions/include/security-permissions.js";
import {fetchPermissions} from '../../services/PermissionService.js'

export default {
    Query: {
        permissions: (_, {id}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!user || (!rbac.isAllowed(user.id, SECURITY_ROLE_SHOW) && !rbac.isAllowed(user.id, SECURITY_ROLE_SHOW_CHILD))) throw new ForbiddenError("Not Authorized")
            return new Promise(((resolve, reject) => {
                fetchPermissions().then(permissions  => {
                    resolve({permissions: permissions.map(p => p.name)})
                }).catch(e => reject(e))
            }))
        },

    }



}
