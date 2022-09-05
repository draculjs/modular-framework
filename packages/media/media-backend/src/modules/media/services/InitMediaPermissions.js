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

const initMediaPermissions = async function () {
    let permissions = [
        FILE_SHOW_ALL,
        FILE_SHOW_OWN,
        FILE_SHOW_PUBLIC,
        FILE_CREATE,
        FILE_UPDATE_ALL,
        FILE_UPDATE_OWN,
        FILE_DELETE_ALL,
        FILE_DELETE_OWN,
        USER_STORAGE_SHOW_ALL,
        USER_STORAGE_SHOW_OWN,
        USER_STORAGE_UPDATE,
        USER_STORAGE_CREATE,
        USER_STORAGE_DELETE,
        FILE_DOWNLOAD
    ]
    await InitService.initPermissions(permissions)
    console.log("Load custom permissions done.")
}

export { initMediaPermissions }
export default initMediaPermissions
