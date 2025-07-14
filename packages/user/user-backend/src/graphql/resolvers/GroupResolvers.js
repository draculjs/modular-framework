import GroupService from '../../services/GroupService.js'
import {
    SECURITY_GROUP_CREATE, SECURITY_GROUP_DELETE, SECURITY_GROUP_EDIT, SECURITY_GROUP_SHOW
} from "../../permissions/include/security-permissions.js";

import { AuthenticationError, ForbiddenError } from "apollo-server-errors";

export default {
    Query: {
        groups: (_, { }, { user, rbac }) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!rbac.isAllowed(user.id, SECURITY_GROUP_SHOW)) throw new ForbiddenError("Not Authorized")
            return GroupService.fetchGroups()
        },
        myGroups: (_, { }, { user, rbac }) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!rbac.isAllowed(user.id, SECURITY_GROUP_SHOW)) throw new ForbiddenError("Not Authorized")
            return GroupService.fetchMyGroups(user.id)
        },
        group: (_, { id }, { user, rbac }) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!rbac.isAllowed(user.id, SECURITY_GROUP_SHOW)) throw new ForbiddenError("Not Authorized")
            return GroupService.findGroup(id)
        },
        groupByName: (_, { name }, { user, rbac }) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!rbac.isAllowed(user.id, SECURITY_GROUP_SHOW)) throw new ForbiddenError("Not Authorized")
            return GroupService.findGroupByName(name)
        },
        groupsPaginate: (_, { limit, pageNumber, search, orderBy, orderDesc, myGroups, showDeletedUsers }, { user, rbac }) => {
            if (!rbac.isAllowed(user.id, SECURITY_GROUP_SHOW)) throw new ForbiddenError("Not Authorized")
            return GroupService.paginateGroup(limit, pageNumber, search, orderBy, orderDesc, myGroups ? user.id : null, showDeletedUsers)
        },

    },
    Mutation: {
        groupCreate: (_, { input }, { user, rbac }) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!user || !rbac.isAllowed(user.id, SECURITY_GROUP_CREATE)) throw new ForbiddenError("Not Authorized")
            return GroupService.createGroup(user, input)
        },
        groupUpdate: (_, { id, input }, { user, rbac }) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!rbac.isAllowed(user.id, SECURITY_GROUP_EDIT)) throw new ForbiddenError("Not Authorized")
            return GroupService.updateGroup(user, id, input)
        },
        groupDelete: (_, { id }, { user, rbac }) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!rbac.isAllowed(user.id, SECURITY_GROUP_DELETE)) throw new ForbiddenError("Not Authorized")
            return GroupService.deleteGroup(id)
        },
    }

}

