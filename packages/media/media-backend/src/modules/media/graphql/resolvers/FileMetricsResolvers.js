
import { fileGlobalMetrics, fileUserMetrics } from '../../services/FileMetricsService'

import { AuthenticationError, ForbiddenError } from "apollo-server-express";

import {
    FILE_SHOW_ALL,
} from "../../permissions/File";

export default {

    Query: {
        fileUserMetrics: (_, { }, { user, rbac }) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!rbac.isAllowed(user.id, FILE_SHOW_ALL)) throw new ForbiddenError("Not Authorized")
            return fileUserMetrics()
        },

        fileGlobalMetrics: (_, { }, { user, rbac }) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!rbac.isAllowed(user.id, FILE_SHOW_ALL)) throw new ForbiddenError("Not Authorized")
            return fileGlobalMetrics()
        },
    }

}
