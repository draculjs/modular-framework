import { UserService } from '@dracul/user-backend'
import { createUserStorage } from '../services/UserStorageService'
import { DefaultLogger as winston } from '@dracul/logger-backend'

export const userCreateListener = function () {
    winston.info(`UserCreateListener: listening for user creation events`);
    
    UserService.UserEventEmitter.on('created', async (user) => {
        try {
            const userId = user.id || user._id;
            const username = user.username || 'unknown';
            
            winston.info(`UserCreateListener: new user created - id='${userId}', username='${username}'`);
            
            const capacity = process.env.MEDIA_DEFAULT_CAPACITY ? parseInt(process.env.MEDIA_DEFAULT_CAPACITY) : 0;
            const usedSpace = 0;
            const maxFileSize = process.env.MEDIA_MAX_SIZE_PER_FILE_IN_MEGABYTES ? parseInt(process.env.MEDIA_MAX_SIZE_PER_FILE_IN_MEGABYTES) : 1024;
            const fileExpirationTime = process.env.MEDIA_FILE_EXPIRATION_TIME_IN_DAYS ? parseInt(process.env.MEDIA_FILE_EXPIRATION_TIME_IN_DAYS) : 365;
            const deleteByLastAccess = true;
            const deleteByCreatedAt = false;
            
            winston.debug(`UserCreateListener: creating storage for user '${username}' with capacity=${capacity}MB, maxFileSize=${maxFileSize}MB, expiration=${fileExpirationTime}days`);
            
            await createUserStorage(user, capacity, usedSpace, maxFileSize, fileExpirationTime, deleteByLastAccess, deleteByCreatedAt);
            
            winston.info(`UserCreateListener: successfully created storage for user '${username}'`);
        } catch (error) {
            winston.error(`UserCreateListener error creating storage for user: ${error.message}`, { 
                error: error.stack,
                userId: user?.id || user?._id,
                username: user?.username 
            });
        }
    });
}

export default { userCreateListener };
