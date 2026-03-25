
import FileService from '../../services/FileService'
import { AuthenticationError, ForbiddenError } from "apollo-server-errors";
import { DefaultLogger as winston } from "@dracul/logger-backend";

import {
    FILE_SHOW_ALL,
    FILE_SHOW_OWN,
    FILE_UPDATE_ALL,
    FILE_UPDATE_OWN,
    FILE_DELETE_ALL,
    FILE_DELETE_OWN,
    FILE_SHOW_PUBLIC
} from "../../permissions/File";

export default {
    Query: {
        fileFind: (_, { id }, { user, rbac }) => {
            const startTime = Date.now();
            const userId = user?.id || 'unknown';
            
            winston.debug(`FileResolvers.fileFind: userId='${userId}', fileId='${id}'`);
            
            if (!user) {
                winston.warn(`FileResolvers.fileFind: unauthenticated access attempt for fileId='${id}'`);
                throw new AuthenticationError("Unauthenticated");
            }
            if (!rbac.isAllowed(user.id, FILE_SHOW_ALL) && !rbac.isAllowed(user.id, FILE_SHOW_OWN)) {
                winston.warn(`FileResolvers.fileFind: forbidden access - userId='${userId}', fileId='${id}'`);
                throw new ForbiddenError("Not Authorized");
            }

            let allFilesAllowed = rbac.isAllowed(user.id, FILE_SHOW_ALL);
            let ownFilesAllowed = rbac.isAllowed(user.id, FILE_SHOW_OWN);
            let publicAllowed = rbac.isAllowed(user.id, FILE_SHOW_PUBLIC);

            winston.debug(`FileResolvers.fileFind: permissions - all=${allFilesAllowed}, own=${ownFilesAllowed}, public=${publicAllowed}`);

            const result = FileService.findFile(id, user.id, allFilesAllowed, ownFilesAllowed, publicAllowed);
            
            result.then(() => {
                winston.info(`FileResolvers.fileFind: success - userId='${userId}', fileId='${id}', duration=${Date.now() - startTime}ms`);
            }).catch((error) => {
                winston.error(`FileResolvers.fileFind: error - userId='${userId}', fileId='${id}', error='${error.message}'`);
            });

            return result;
        },
        filePaginate: (_, { input }, { user, rbac }) => {
            const userId = user?.id || 'unknown';
            
            if (!user) {
                winston.warn(`FileResolvers.filePaginate: unauthenticated access attempt`);
                throw new AuthenticationError("Unauthenticated");
            }

            if (!rbac.isAllowed(user.id, FILE_SHOW_ALL) && !rbac.isAllowed(user.id, FILE_SHOW_OWN) && !rbac.isAllowed(user.id, FILE_SHOW_PUBLIC)) {
                winston.warn(`FileResolvers.filePaginate: forbidden access - userId='${userId}'`);
                throw new ForbiddenError("Not Authorized");
            }

            let allFilesAllowed = rbac.isAllowed(user.id, FILE_SHOW_ALL);
            let ownFilesAllowed = rbac.isAllowed(user.id, FILE_SHOW_OWN);
            let publicAllowed = rbac.isAllowed(user.id, FILE_SHOW_PUBLIC);
            

            const result = FileService.paginateFiles(input, user.id, allFilesAllowed, ownFilesAllowed, publicAllowed);
            
            result.then().catch((error) => {
                winston.error(`FileResolvers.filePaginate: error - userId='${userId}', error='${error.message}'`);
            })

            return result;
        },
    },
    Mutation: {
        fileUpdate: async(_, { input, file }, { user, rbac }) => {
            const startTime = Date.now();
            const userId = user?.id || 'unknown';
            const fileId = input?.id || 'unknown';
            
            winston.debug(`FileResolvers.fileUpdate: userId='${userId}', fileId='${fileId}', hasFile=${!!file}`);
            
            if (!user) {
                winston.warn(`FileResolvers.fileUpdate: unauthenticated access attempt for fileId='${fileId}'`);
                throw new AuthenticationError("Unauthenticated");
            }
            if (!rbac.isAllowed(user.id, FILE_UPDATE_ALL) && !rbac.isAllowed(user.id, FILE_UPDATE_OWN)) {
                winston.warn(`FileResolvers.fileUpdate: forbidden access - userId='${userId}', fileId='${fileId}'`);
                throw new ForbiddenError("Not Authorized");
            }

            let allFilesAllowed = rbac.isAllowed(user.id, FILE_SHOW_ALL);
            let ownFilesAllowed = rbac.isAllowed(user.id, FILE_SHOW_OWN) || rbac.isAllowed(user.id, FILE_UPDATE_OWN);
            let publicAllowed = rbac.isAllowed(user.id, FILE_SHOW_PUBLIC);

            winston.debug(`FileResolvers.fileUpdate: permissions - all=${allFilesAllowed}, own=${ownFilesAllowed}, public=${publicAllowed}`);

            try {
                const result = await FileService.updateFile(user, file, input, user.id, allFilesAllowed, ownFilesAllowed, publicAllowed);
                winston.info(`FileResolvers.fileUpdate: success - userId='${userId}', fileId='${fileId}', duration=${Date.now() - startTime}ms`);
                return result;
            } catch (error) {
                winston.error(`FileResolvers.fileUpdate: error - userId='${userId}', fileId='${fileId}', error='${error.message}'`);
                throw error;
            }
        },
        fileDelete: (_, { id }, { user, rbac }) => {
            const startTime = Date.now();
            const userId = user?.id || 'unknown';
            
            winston.debug(`FileResolvers.fileDelete: userId='${userId}', fileId='${id}'`);
            
            if (!user) {
                winston.warn(`FileResolvers.fileDelete: unauthenticated access attempt for fileId='${id}'`);
                throw new AuthenticationError("Unauthenticated");
            }
            if (!rbac.isAllowed(user.id, FILE_DELETE_ALL) && !rbac.isAllowed(user.id, FILE_DELETE_OWN)) {
                winston.warn(`FileResolvers.fileDelete: forbidden access - userId='${userId}', fileId='${id}'`);
                throw new ForbiddenError("Not Authorized");
            }

            let allFilesAllowed = rbac.isAllowed(user.id, FILE_SHOW_ALL);
            let ownFilesAllowed = rbac.isAllowed(user.id, FILE_SHOW_OWN) || rbac.isAllowed(user.id, FILE_DELETE_OWN);
            let publicAllowed = rbac.isAllowed(user.id, FILE_SHOW_PUBLIC);

            winston.debug(`FileResolvers.fileDelete: permissions - all=${allFilesAllowed}, own=${ownFilesAllowed}, public=${publicAllowed}`);

            const result = FileService.deleteFile(id, user.id, allFilesAllowed, ownFilesAllowed, publicAllowed);
            
            result.then(() => {
                winston.info(`FileResolvers.fileDelete: success - userId='${userId}', fileId='${id}', duration=${Date.now() - startTime}ms`);
            }).catch((error) => {
                winston.error(`FileResolvers.fileDelete: error - userId='${userId}', fileId='${id}', error='${error.message}'`);
            });

            return result;
        },
    }
}
