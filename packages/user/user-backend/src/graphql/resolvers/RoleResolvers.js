import {createRole, findPermissions, findRole, findRoles, deleteRole, updateRole} from '../../services/RoleService'
import {
    SECURITY_ROLE_CREATE,
    SECURITY_ROLE_SHOW,
    SECURITY_ROLE_DELETE,
    SECURITY_ROLE_EDIT,
    SECURITY_ROLE_SHOW_CHILD
} from "../../permissions";
import {AuthenticationError, ForbiddenError} from "apollo-server-express";
import {findUser} from "../../services/UserService";

export default {
    Query: {
        roles: async (_, {id}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")

            user = await findUser(user.id)

            if (rbac.isAllowed(user.id, SECURITY_ROLE_SHOW)){
                return findRoles()
            }else if(rbac.isAllowed(user.id, SECURITY_ROLE_SHOW_CHILD)){
                return findRoles(user.role.childRoles)
            }else{
                throw new ForbiddenError("Not Authorized")
            }

        },
        role: (_, {id}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!user || !rbac.isAllowed(user.id, SECURITY_ROLE_SHOW)) throw new ForbiddenError("Not Authorized")
            return findRole(id)
        },
    },
    Mutation: {
        roleCreate: (_, {input}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!user || !rbac.isAllowed(user.id, SECURITY_ROLE_CREATE)) throw new ForbiddenError("Not Authorized")
            return createRole(input)
        },
         roleUpdate: (_, {id, input}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, SECURITY_ROLE_EDIT)) throw new ForbiddenError("Not Authorized")
            return updateRole(id, input)
        },
         roleDelete: (_, {id}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, SECURITY_ROLE_DELETE)) throw new ForbiddenError("Not Authorized")
            return deleteRole(id)
        },
    }

}
