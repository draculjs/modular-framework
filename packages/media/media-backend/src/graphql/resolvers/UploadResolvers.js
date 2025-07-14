
import { AuthenticationError, ForbiddenError } from "apollo-server-errors";
import { DefaultLogger } from '@dracul/logger-backend';

import fileUploadAnonymous from "../../services/UploadAnonymousService.js";
import { fileUpload } from '../../services/UploadService.js';
import { FILE_CREATE } from "../../permissions/File.js";



export default {

    Mutation: {
        fileUpload: (_, { file, expirationDate, isPublic, description, tags, groups, users }, { user, rbac }) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!rbac.isAllowed(user.id, FILE_CREATE)) throw new ForbiddenError("Not Authorized")
            DefaultLogger.info(`file: ${JSON.stringify(file)}`)
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

