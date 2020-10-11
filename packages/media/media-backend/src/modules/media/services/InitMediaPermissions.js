import {
    FILE_SHOW,
    FILE_CREATE,
    FILE_UPDATE,
    FILE_DELETE
} from '../permissions/File'

import {InitService} from "@ci-user-module/api";

const initMediaPermissions = async function () {
    let permissions = [
        FILE_SHOW,
        FILE_CREATE,
        FILE_UPDATE,
        FILE_DELETE]
    await InitService.initPermissions(permissions)
    console.log("Load custom permissions done.")
}

export {initMediaPermissions}
export default initMediaPermissions