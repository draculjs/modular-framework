
import {
    createQueue,
    updateQueue,
    deleteQueue,
    findQueue,
    fetchQueues,
    paginateQueues,
    findQueueByTopicAndState
} from '@dracul/mongoose-queue'

import {AuthenticationError, ForbiddenError} from "apollo-server-errors";

import {
    QUEUE_SHOW,
    QUEUE_UPDATE,
    QUEUE_CREATE,
    QUEUE_DELETE
} from "../../permissions";

export default {
    Query: {
        queueFind: (_, {id}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, QUEUE_SHOW)) throw new ForbiddenError("Not Authorized")
            return findQueue(id)
        },
        queueFindByTopicAndState: (_, {topic, state}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, QUEUE_SHOW)) throw new ForbiddenError("Not Authorized")
            return findQueueByTopicAndState(topic, state)
        },
        queueFetch: (_, {}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, QUEUE_SHOW)) throw new ForbiddenError("Not Authorized")
            return fetchQueues()
        },
        queuePaginate: (_, {pageNumber, itemsPerPage, search, orderBy, orderDesc}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, QUEUE_SHOW)) throw new ForbiddenError("Not Authorized")
            return paginateQueues(pageNumber, itemsPerPage, search, orderBy, orderDesc)
        },

    },
    Mutation: {
        queueCreate: (_, {input}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, QUEUE_CREATE)) throw new ForbiddenError("Not Authorized")
            return createQueue(user, input)
        },
        queueUpdate: (_, {id, input}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, QUEUE_UPDATE)) throw new ForbiddenError("Not Authorized")
            return updateQueue(user, id, input)
        },
        queueDelete: (_, {id}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, QUEUE_DELETE)) throw new ForbiddenError("Not Authorized")
            return deleteQueue(id)
        },
    }

}

