import {
    createGroup,
    updateGroup,
    deleteGroup,
    findGroup,
    fetchGroups,
    paginateGroup,
    fetchMyGroups, findGroupByName
} from '../../services/GroupService'
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
        myGroups: (_, {}, {user, rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!rbac.isAllowed(user.id, SECURITY_GROUP_SHOW)) throw new ForbiddenError("Not Authorized")
            return fetchMyGroups(user.id)
        },
        group: (_, {id}, {user, rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!rbac.isAllowed(user.id, SECURITY_GROUP_SHOW)) throw new ForbiddenError("Not Authorized")
            return findGroup(id)
        },
        groupByName: (_, {name}, {user, rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!rbac.isAllowed(user.id, SECURITY_GROUP_SHOW)) throw new ForbiddenError("Not Authorized")
            return findGroupByName(name)
        },
        groupsPaginate: (_, {limit, pageNumber, search, orderBy, orderDesc, myGroups}, {user, rbac}) => {
            if (!rbac.isAllowed(user.id, SECURITY_GROUP_SHOW)) throw new ForbiddenError("Not Authorized")
            return paginateGroup(limit, pageNumber, search, orderBy, orderDesc, myGroups ? user.id : null)
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

