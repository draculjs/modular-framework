import {
    createUser,
    updateUser,
    deleteUser,
    findUsers,
    findUser,
    changePasswordAdmin,
    paginateUsers
} from '../../services/UserService'

import {
    AuthenticationError,
    ForbiddenError
} from "apollo-server-express";

import {
    SECURITY_USER_CREATE,
    SECURITY_USER_DELETE,
    SECURITY_USER_EDIT,
    SECURITY_USER_SHOW
} from "../../permissions";

import {avatarUpload} from "../../services/ProfileService";

export default {
    Query: {

        users: (_, {}, {user, rbac}) => {
            if (!user) throw new AuthenticationError("UNAUTHENTICATED")
            if (!user || !rbac.isAllowed(user.id, SECURITY_USER_SHOW)) throw new ForbiddenError("Not Authorized")
            return findUsers(user.role.childRoles)
        },

        user: (_, {id}, {user, rbac}) => {
            if (!user) throw new AuthenticationError("UNAUTHENTICATED")
            if (!user || !rbac.isAllowed(user.id, SECURITY_USER_SHOW)) throw new ForbiddenError("Not Authorized")
            return findUser(id)
        },

        paginateUsers: (_, {limit, pageNumber, search, orderBy, orderDesc}, {user, rbac}) => {
            if (!user) throw new AuthenticationError("UNAUTHENTICATED")
            if (!user || !rbac.isAllowed(user.id, SECURITY_USER_SHOW)) throw new ForbiddenError("Not Authorized")

            return paginateUsers(limit, pageNumber, search, orderBy, orderDesc, user.role.childRoles)
        },

    },
    Mutation: {
        adminAvatarUpload: async (_, {id, file}, {user}) => {
            if (!user) throw new AuthenticationError("UNAUTHENTICATED")
            if (!user || !rbac.isAllowed(user.id, SECURITY_USER_EDIT)) throw new ForbiddenError("Not Authorized")
            let userDst = await findUser(id)
            return avatarUpload(userDst, file)
        },
        createUser: (_, {input}, {user, rbac}) => {
            if (!user) throw new AuthenticationError("UNAUTHENTICATED")
            if (!user || !rbac.isAllowed(user.id, SECURITY_USER_CREATE)) throw new ForbiddenError("Not Authorized")


            //With childRoles
            if (user.role.childRoles && user.role.childRoles.length) {
                //Check if role is include as a childRole
                if (user.role.childRoles.includes(input.role)) {
                    return createUser(input, user)
                } else {
                    throw new ForbiddenError("Not Authorized")
                }

            //Without childRoles
            } else {
                return createUser(input, user)
            }

        },

        updateUser: (_, {id, input}, {user, rbac}) => {
            if (!user) throw new AuthenticationError("UNAUTHENTICATED")
            if (!user || !rbac.isAllowed(user.id, SECURITY_USER_EDIT)) throw new ForbiddenError("Not Authorized")

            //With childRoles
            if (user.role.childRoles && user.role.childRoles.length) {
                //Check if role is include as a childRole
                if (user.role.childRoles.includes(input.role)) {
                    return updateUser(id, input, user)
                } else {
                    throw new ForbiddenError("Not Authorized")
                }

            //Without childRoles
            } else {
                return updateUser(id, input, user)
            }


        },

        deleteUser:  async (_, {id}, {user, rbac}) => {
            if (!user) throw new AuthenticationError("UNAUTHENTICATED")
            if (!user || !rbac.isAllowed(user.id, SECURITY_USER_DELETE)) throw new ForbiddenError("Not Authorized")


            //With childRoles
            if (user.role.childRoles && user.role.childRoles.length) {
                //Check if role is include as a childRole

                let userToDelete = await findUser(id)

                if (user.role.childRoles.includes(userToDelete.role.id)) {
                    return deleteUser(id, user)
                } else {
                    throw new ForbiddenError("Not Authorized")
                }

            //Without childRoles
            } else {
                return deleteUser(id, user)
            }

        },

        changePasswordAdmin: (_, {id, password, passwordVerify}, {user, rbac}) => {
            if (!user) throw new AuthenticationError("UNAUTHENTICATED")
            if (!user || !rbac.isAllowed(user.id, SECURITY_USER_EDIT)) throw new ForbiddenError("Not Authorized")
            return changePasswordAdmin(id, {password, passwordVerify}, user)
        }
    }

}
