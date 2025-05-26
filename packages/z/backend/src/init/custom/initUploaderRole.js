import {
    filePermissions, userStoragePermissions
} from '@dracul/media-backend'
import { permissions as userPermissions } from '@dracul/user-backend'

module.exports = {
    name: "uploader",
    permissions: [
        filePermissions.FILE_CREATE,
        filePermissions.FILE_SHOW_OWN,
        filePermissions.FILE_SHOW_PUBLIC,
        filePermissions.FILE_UPDATE_OWN,
        filePermissions.FILE_DELETE_OWN,
        filePermissions.FILE_DOWNLOAD,
        userStoragePermissions.USER_STORAGE_SHOW_OWN,
        userPermissions.SECURITY_USER_SHOW,
        userPermissions.SECURITY_GROUP_SHOW
    ]
}
