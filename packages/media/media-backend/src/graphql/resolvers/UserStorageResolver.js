import { AuthenticationError, ForbiddenError } from "apollo-server-errors";
import { DefaultLogger as winston } from "@dracul/logger-backend";
import { fetchUserStorage, updateUserStorage, findUserStorageByUser } from "../../services/UserStorageService";
import { USER_STORAGE_SHOW_ALL, USER_STORAGE_SHOW_OWN, USER_STORAGE_UPDATE } from "../../permissions/UserStorage";

export default {
  Query: {
    userStorageFetch: (_, { }, { user, rbac }) => {
        const startTime = Date.now();
        const userId = user?.id || 'unknown';
        
        winston.debug(`UserStorageResolver.userStorageFetch: userId='${userId}'`);
        
        if (!user) {
            winston.warn(`UserStorageResolver.userStorageFetch: unauthenticated access attempt`);
            throw new AuthenticationError("Unauthenticated");
        }
        if (!rbac.isAllowed(user.id, USER_STORAGE_SHOW_ALL)) {
            winston.warn(`UserStorageResolver.userStorageFetch: forbidden - userId='${userId}' lacks USER_STORAGE_SHOW_ALL`);
            throw new ForbiddenError("Not Authorized");
        }

        const result = fetchUserStorage();
        
        result.then((storages) => {
            winston.info(`UserStorageResolver.userStorageFetch: success - userId='${userId}', count=${storages?.length || 0}, duration=${Date.now() - startTime}ms`);
        }).catch((error) => {
            winston.error(`UserStorageResolver.userStorageFetch: error - userId='${userId}', error='${error.message}'`);
        });

        return result;
    },
    userStorageFindByUser: (_, { }, { user, rbac }) => {
        const startTime = Date.now();
        const userId = user?.id || 'unknown';
        
        winston.debug(`UserStorageResolver.userStorageFindByUser: userId='${userId}'`);
        
        if (!user) {
            winston.warn(`UserStorageResolver.userStorageFindByUser: unauthenticated access attempt`);
            throw new AuthenticationError("Unauthenticated");
        }
        if (!rbac.isAllowed(user.id, USER_STORAGE_SHOW_OWN)) {
            winston.warn(`UserStorageResolver.userStorageFindByUser: forbidden - userId='${userId}' lacks USER_STORAGE_SHOW_OWN`);
            throw new ForbiddenError("Not Authorized");
        }

        const result = findUserStorageByUser(user);
        
        result.then((storage) => {
            winston.info(`UserStorageResolver.userStorageFindByUser: success - userId='${userId}', storageId='${storage?._id}', duration=${Date.now() - startTime}ms`);
        }).catch((error) => {
            winston.error(`UserStorageResolver.userStorageFindByUser: error - userId='${userId}', error='${error.message}'`);
        });

        return result;
    },
    fetchMediaVariables: (_, { }) => {
        const maxFileSize = process.env.MEDIA_MAX_SIZE_PER_FILE_IN_MEGABYTES || 1024;
        const fileExpirationTime = process.env.MEDIA_FILE_EXPIRATION_TIME_IN_DAYS || 365;
        
        winston.debug(`UserStorageResolver.fetchMediaVariables: maxFileSize=${maxFileSize}, fileExpirationTime=${fileExpirationTime}`);
        
        const mediaVariables = {
            maxFileSize,
            fileExpirationTime
        };

        return mediaVariables;
    },
  },
  Mutation: {
    userStorageUpdate: (_, { id, input }, { user, rbac }) => {
        const startTime = Date.now();
        const userId = user?.id || 'unknown';
        
        winston.debug(`UserStorageResolver.userStorageUpdate: userId='${userId}', storageId='${id}', input=${JSON.stringify(input)}`);
        
        if (!user) {
            winston.warn(`UserStorageResolver.userStorageUpdate: unauthenticated access attempt for storageId='${id}'`);
            throw new AuthenticationError("Unauthenticated");
        }
        if (!rbac.isAllowed(user.id, USER_STORAGE_UPDATE)) {
            winston.warn(`UserStorageResolver.userStorageUpdate: forbidden - userId='${userId}', storageId='${id}'`);
            throw new ForbiddenError("Not Authorized");
        }

        const result = updateUserStorage(user, id, input);
        
        result.then(() => {
            winston.info(`UserStorageResolver.userStorageUpdate: success - userId='${userId}', storageId='${id}', duration=${Date.now() - startTime}ms`);
        }).catch((error) => {
            winston.error(`UserStorageResolver.userStorageUpdate: error - userId='${userId}', storageId='${id}', error='${error.message}'`);
        });

        return result;
    },
  },
};
