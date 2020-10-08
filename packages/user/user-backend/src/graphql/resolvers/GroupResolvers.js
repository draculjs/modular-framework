import {createGroup, updateGroup, deleteGroup, findGroup, fetchGroups, paginateGroup} from '../../services/GroupService'
import {
    SECURITY_GROUP_CREATE,
    SECURITY_GROUP_DELETE,
    SECURITY_GROUP_EDIT,
    SECURITY_GROUP_SHOW
} from "../../permissions";

import {AuthenticationError, ForbiddenError} from "apollo-server-express";

export default {
    Query: {
        groups: (_, {}, {user, rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!rbac.isAllowed(user.id, SECURITY_GROUP_SHOW)) throw new ForbiddenError("Not Authorized")
            return fetchGroups()
        },
        group: (_, {id}, {user, rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!rbac.isAllowed(user.id, SECURITY_GROUP_SHOW)) throw new ForbiddenError("Not Authorized")
            return findGroup(id)
        },
        groupsPaginate: (_, {limit, pageNumber, search, orderBy, orderDesc}, {user, rbac}) => {
            if (!rbac.isAllowed(user.id, SECURITY_GROUP_SHOW)) throw new ForbiddenError("Not Authorized")
            return paginateGroup(limit, pageNumber, search, orderBy, orderDesc)
        },

    },
    Mutation: {
        groupCreate: (_, {input}, {user, rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!user || !rbac.isAllowed(user.id, SECURITY_GROUP_CREATE)) throw new ForbiddenError("Not Authorized")
            return createGroup(user, input)
        },
        groupUpdate: (_, {id, input}, {user, rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!rbac.isAllowed(user.id, SECURITY_GROUP_EDIT)) throw new ForbiddenError("Not Authorized")
            return updateGroup(user, id, input)
        },
        groupDelete: (_, {id}, {user, rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!rbac.isAllowed(user.id, SECURITY_GROUP_DELETE)) throw new ForbiddenError("Not Authorized")
            return deleteGroup(id)
        },
    }

}

