
import { fileUpload } from '../../services/UploadService'
import fileUploadAnonymous from "../../services/UploadAnonymousService";
import { AuthenticationError, ForbiddenError } from "apollo-server-errors";
import { DefaultLogger as winston } from "@dracul/logger-backend";

import {
    FILE_CREATE,
} from "../../permissions/File";

export default {

    Mutation: {
        fileUpload: (_, { file, expirationDate, isPublic, description, tags, groups, users }, { user, rbac }) => {
            const startTime = Date.now();
            const userId = user?.id || 'unknown';
            
            winston.debug(`UploadResolvers.fileUpload: userId='${userId}', filename='${file?.filename || 'unknown'}', expirationDate='${expirationDate}', isPublic=${isPublic}`);
            
            if (!user) {
                winston.warn(`UploadResolvers.fileUpload: unauthenticated upload attempt`);
                throw new AuthenticationError("Unauthenticated");
            }
            if (!rbac.isAllowed(user.id, FILE_CREATE)) {
                winston.warn(`UploadResolvers.fileUpload: forbidden - userId='${userId}' lacks FILE_CREATE permission`);
                throw new ForbiddenError("Not Authorized");
            }

            const result = fileUpload(user, file, expirationDate, isPublic, description, tags, groups, users);
            
            result.then((uploadedFile) => {
                winston.info(`UploadResolvers.fileUpload: success - userId='${userId}', fileId='${uploadedFile?._id || uploadedFile?.id}', filename='${file?.filename}', duration=${Date.now() - startTime}ms`);
            }).catch((error) => {
                winston.error(`UploadResolvers.fileUpload: error - userId='${userId}', filename='${file?.filename}', error='${error.message}'`);
            });

            return result;
        },
        fileUploadAnonymous: (_, { file }) => {
            const startTime = Date.now();
            
            winston.debug(`UploadResolvers.fileUploadAnonymous: filename='${file?.filename || 'unknown'}'`);
            
            const anonymousEnabled = process.env.MEDIA_UPLOAD_ANONYMOUS === 'enable' || process.env.MEDIA_UPLOAD_ANONYMOUS === 'true';
            
            if (!anonymousEnabled) {
                winston.warn(`UploadResolvers.fileUploadAnonymous: anonymous upload disabled but attempted, filename='${file?.filename}'`);
                return Promise.reject("Anonymous upload disable");
            }
            
            winston.info(`UploadResolvers.fileUploadAnonymous: anonymous upload enabled, proceeding with upload`);

            const result = fileUploadAnonymous(file);
            
            result.then((uploadedFile) => {
                winston.info(`UploadResolvers.fileUploadAnonymous: success - fileId='${uploadedFile?._id || uploadedFile?.id}', filename='${file?.filename}', duration=${Date.now() - startTime}ms`);
            }).catch((error) => {
                winston.error(`UploadResolvers.fileUploadAnonymous: error - filename='${file?.filename}', error='${error.message}'`);
            });

            return result;
        },
    }
}
