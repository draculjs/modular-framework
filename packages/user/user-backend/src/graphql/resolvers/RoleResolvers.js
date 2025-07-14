import {AuthenticationError, ForbiddenError} from "apollo-server-errors";

import {
    SECURITY_ROLE_CREATE, SECURITY_ROLE_SHOW, SECURITY_ROLE_DELETE, SECURITY_ROLE_EDIT, SECURITY_ROLE_SHOW_CHILD
} from "../../permissions/include/security-permissions.js";

import UserService from "../../services/UserService.js";
import RoleService from '../../services/RoleService.js'

export default {
    Query: {
        roles: async (_, {id}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")

            user = await UserService.findUser(user.id)

            if (rbac.isAllowed(user.id, SECURITY_ROLE_SHOW)){
                return RoleService.findRoles()
            }else if(rbac.isAllowed(user.id, SECURITY_ROLE_SHOW_CHILD)){
                return RoleService.findRoles(user.role.childRoles)
            }else{
                throw new ForbiddenError("Not Authorized")
            }

        },
        role: (_, {id}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!user || !rbac.isAllowed(user.id, SECURITY_ROLE_SHOW)) throw new ForbiddenError("Not Authorized")
            return RoleService.findRole(id)
        },
    },
    Mutation: {
        roleCreate: (_, {input}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!user || !rbac.isAllowed(user.id, SECURITY_ROLE_CREATE)) throw new ForbiddenError("Not Authorized")
            return RoleService.createRole(input)
        },
         roleUpdate: (_, {id, input}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, SECURITY_ROLE_EDIT)) throw new ForbiddenError("Not Authorized")
            return RoleService.updateRole(id, input)
        },
         roleDelete: (_, {id}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, SECURITY_ROLE_DELETE)) throw new ForbiddenError("Not Authorized")
            return RoleService.deleteRole(id)
        },
    }

}
