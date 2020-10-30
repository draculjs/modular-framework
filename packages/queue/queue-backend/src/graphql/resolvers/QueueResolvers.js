
import {
    fetchQueues
} from '@dracul/mongoose-queue'

import {AuthenticationError, ForbiddenError} from "apollo-server-express";

import {
    QUEUE_SHOW,
} from "../../permissions";

export default {
    Query: {
        queues: (_, {id}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, QUEUE_SHOW)) throw new ForbiddenError("Not Authorized")
            return fetchQueues()
        },
    }

}

