import {
    FILE_SHOW_ALL,
    FILE_SHOW_OWN,
    FILE_CREATE,
    FILE_UPDATE_ALL,
    FILE_UPDATE_OWN,
    FILE_DELETE_ALL,
    FILE_DELETE_OWN,
    FILE_SHOW_PUBLIC,
    FILE_DOWNLOAD
} from '../permissions/File'

import {
    USER_STORAGE_SHOW_ALL,
    USER_STORAGE_SHOW_OWN,
    USER_STORAGE_UPDATE,
    USER_STORAGE_CREATE,
    USER_STORAGE_DELETE
} from '../permissions/UserStorage'

import { InitService } from "@dracul/user-backend";
import { DefaultLogger as winston } from "@dracul/logger-backend";

const MEDIA_PERMISSIONS = [
    FILE_SHOW_ALL,
    FILE_SHOW_OWN,
    FILE_SHOW_PUBLIC,
    FILE_CREATE,
    FILE_UPDATE_ALL,
    FILE_UPDATE_OWN,
    FILE_DELETE_ALL,
    FILE_DELETE_OWN,
    FILE_DOWNLOAD,
    USER_STORAGE_SHOW_ALL,
    USER_STORAGE_SHOW_OWN,
    USER_STORAGE_UPDATE,
    USER_STORAGE_CREATE,
    USER_STORAGE_DELETE
];

const initMediaPermissions = async function () {
    try {
        winston.info(`InitMediaPermissions: initializing ${MEDIA_PERMISSIONS.length} permissions`);
        
        await InitService.initPermissions(MEDIA_PERMISSIONS);
        
        winston.info(`InitMediaPermissions: successfully initialized ${MEDIA_PERMISSIONS.length} media permissions`);
    } catch (error) {
        winston.error(`InitMediaPermissions error: ${error.message}`, { error: error.stack });
        throw error;
    }
}

export { initMediaPermissions }
export default initMediaPermissions
