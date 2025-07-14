import { AuthenticationError, ForbiddenError } from "apollo-server-errors";

import UserService from '../../services/UserService.js'

import {
    SECURITY_USER_CREATE,
    SECURITY_USER_DELETE,
    SECURITY_USER_EDIT,
    SECURITY_USER_SHOW
} from "../../permissions/include/security-permissions.js";

import {avatarUpload} from "../../services/ProfileService.js";

export default {
    Query: {

        users: (_, {}, {user, rbac}) => {
            if (!user) throw new AuthenticationError("UNAUTHENTICATED")
            if (!user || !rbac.isAllowed(user.id, SECURITY_USER_SHOW)) throw new ForbiddenError("Not Authorized")
            return UserService.findUsers(user.role.childRoles, user.id)
        },
        usersByRole: (_, {roleName}, {user, rbac}) => {
            if (!user) throw new AuthenticationError("UNAUTHENTICATED")
            if (!user || !rbac.isAllowed(user.id, SECURITY_USER_SHOW)) throw new ForbiddenError("Not Authorized")
            return UserService.findUsersByRole(roleName)
        },
        usersByRoles: (_, {roleNames}, {user, rbac}) => {
            if (!user) throw new AuthenticationError("UNAUTHENTICATED")
            if (!user || !rbac.isAllowed(user.id, SECURITY_USER_SHOW)) throw new ForbiddenError("Not Authorized")
            return UserService.findUsersByRoles(roleNames)
        },
        user: (_, {id}, {user, rbac}) => {
            if (!user) throw new AuthenticationError("UNAUTHENTICATED")
            if (!user || !rbac.isAllowed(user.id, SECURITY_USER_SHOW)) throw new ForbiddenError("Not Authorized")
            return UserService.findUser(id)
        },

        paginateUsers: async (_, {limit, pageNumber, search, orderBy, orderDesc, activeUsers}, {user, rbac}) => {
            if (!user) throw new AuthenticationError("UNAUTHENTICATED")
            if (!user || !rbac.isAllowed(user.id, SECURITY_USER_SHOW)) throw new ForbiddenError("Not Authorized")
            user = await UserService.findUser(user.id)
            return UserService.paginateUsers(limit, pageNumber, search, orderBy, orderDesc, user.role.childRoles, activeUsers)
        },

    },
    Mutation: {
        adminAvatarUpload: async (_, {id, file}, {user, rbac}) => {
            if (!user) throw new AuthenticationError("UNAUTHENTICATED")
            if (!user || !rbac.isAllowed(user.id, SECURITY_USER_EDIT)) throw new ForbiddenError("Not Authorized")
            let userDst = await UserService.findUser(id)
            return avatarUpload(userDst, file)
        },
        createUser: async (_, {input}, {user, rbac}) => {
            if (!user) throw new AuthenticationError("UNAUTHENTICATED")
            if (!user || !rbac.isAllowed(user.id, SECURITY_USER_CREATE)) throw new ForbiddenError("Not Authorized")

            user = await UserService.findUser(user.id)
            //With childRoles
            if (user.role.childRoles && user.role.childRoles.length) {
                //Check if role is include as a childRole
                if (user.role.childRoles.includes(input.role)) {
                    return UserService.createUser(input, user)
                } else {
                    throw new ForbiddenError("Not Authorized")
                }

                //Without childRoles
            } else {
                return UserService.createUser(input, user)
            }


        },

        updateUser: async (_, {id, input}, {user, rbac}) => {
            if (!user) throw new AuthenticationError("UNAUTHENTICATED")
            if (!user || !rbac.isAllowed(user.id, SECURITY_USER_EDIT)) throw new ForbiddenError("Not Authorized")

            user = await UserService.findUser(user.id)

            //With childRoles
            if (user.role.childRoles && user.role.childRoles.length) {
                //Check if role is include as a childRole
                if (user.role.childRoles.includes(input.role)) {
                    return UserService.updateUser(id, input, user)
                } else {
                    throw new ForbiddenError("Not Authorized")
                }

                //Without childRoles
            } else {
                return UserService.updateUser(id, input, user)
            }


        },

        deleteUser: async (_, {id}, {user, rbac}) => {
            if (!user) throw new AuthenticationError("UNAUTHENTICATED")
            if (!user || !rbac.isAllowed(user.id, SECURITY_USER_DELETE)) throw new ForbiddenError("Not Authorized")

            user = await UserService.findUser(user.id)

            //With childRoles
            if (user.role.childRoles && user.role.childRoles.length) {
                //Check if role is include as a childRole

                let userToDelete = await UserService.findUser(id)

                if (user.role.childRoles.includes(userToDelete.role.id)) {
                    return UserService.deleteUser(id, user)
                } else {
                    throw new ForbiddenError("Not Authorized")
                }

                //Without childRoles
            } else {
                return UserService.deleteUser(id, user)
            }

        },

        changePasswordAdmin: (_, {id, password, passwordVerify}, {user, rbac}) => {
            if (!user) throw new AuthenticationError("UNAUTHENTICATED")
            if (!user || !rbac.isAllowed(user.id, SECURITY_USER_EDIT)) throw new ForbiddenError("Not Authorized")
            return UserService.changePasswordAdmin(id, {password, passwordVerify}, user)
        }
    }

}
