
import { fileUpload } from '../../services/UploadService'
import fileUploadAnonymous from "../../services/UploadAnonymousService";

import { AuthenticationError, ForbiddenError } from "apollo-server-express";

import {
    FILE_CREATE,
} from "../../permissions/File";

export default {

    Mutation: {
        fileUpload: (_, { file, expirationDate, isPublic, description, tags, groups, users }, { user, rbac }) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!rbac.isAllowed(user.id, FILE_CREATE)) throw new ForbiddenError("Not Authorized")
            return fileUpload(user, file, expirationDate, isPublic, description, tags, groups, users)
        },
        fileUploadAnonymous: (_, { file }) => {
            if (process.env.MEDIA_UPLOAD_ANONYMOUS === 'enable' || process.env.MEDIA_UPLOAD_ANONYMOUS === 'true') {
                return fileUploadAnonymous(file)
            }
            return Promise.reject("Anonymous upload disable")
        },
    }

}

