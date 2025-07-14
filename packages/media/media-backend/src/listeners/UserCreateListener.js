import { UserService } from '@dracul/user-backend'
import { createUserStorage } from '../services/UserStorageService.js'
import { DefaultLogger } from '@dracul/logger-backend';

export default function userCreateListener(){
    try {
        UserService.UserEventEmitter.on('created', async (user) => {
            const capacity = process.env.MEDIA_DEFAULT_CAPACITY ? process.env.MEDIA_DEFAULT_CAPACITY : 0;
            const usedSpace = 0;
            const maxFileSize = process.env.MEDIA_MAX_SIZE_PER_FILE_IN_MEGABYTES || 1024;
            const fileExpirationTime = process.env.MEDIA_FILE_EXPIRATION_TIME_IN_DAYS || 365;
            const deleteByLastAccess = true;
            const deleteByCreatedAt = false;
            await createUserStorage(user, capacity, usedSpace, maxFileSize, fileExpirationTime, deleteByLastAccess, deleteByCreatedAt)
        });
    } catch (error) {
        DefaultLogger.error(`An error happened at userCreateListener: ${error}`)
    }
}