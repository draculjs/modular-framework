import {
    FILE_SHOW_ALL,
    FILE_SHOW_OWN,
    FILE_CREATE,
    FILE_UPDATE_ALL,
    FILE_UPDATE_OWN,
    FILE_DELETE_ALL,
    FILE_DELETE_OWN
} from '../permissions/File'

import { InitService } from "@dracul/user-backend";

const initMediaPermissions = async function () {
    let permissions = [
        FILE_SHOW_ALL,
        FILE_SHOW_OWN,
        FILE_CREATE,
        FILE_UPDATE_ALL,
        FILE_UPDATE_OWN,
        FILE_DELETE_ALL,
        FILE_DELETE_OWN
    ]
    await InitService.initPermissions(permissions)
    console.log("Load custom permissions done.")
}

export { initMediaPermissions }
export default initMediaPermissions