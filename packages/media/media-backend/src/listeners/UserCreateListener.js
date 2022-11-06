import { UserService } from '@dracul/user-backend'
import { createUserStorage } from '../services/UserStorageService'

export const userCreateListener = function () {
    UserService.UserEventEmitter.on('created', async (user) => {
        let capacity = process.env.MEDIA_DEFAULT_CAPACITY ? process.env.MEDIA_DEFAULT_CAPACITY : 0;
        let usedSpace = 0;
        let maxFileSize = process.env.MEDIA_MAX_SIZE_PER_FILE_IN_MEGABYTES || 1024;
        let fileExpirationTime = process.env.MEDIA_FILE_EXPIRATION_TIME_IN_DAYS || 365;
        let deleteByLastAccess = true;
        let deleteByCreatedAt = false;
        await createUserStorage(user, capacity, usedSpace, maxFileSize, fileExpirationTime, deleteByLastAccess, deleteByCreatedAt)
    });
}

export default { userCreateListener };