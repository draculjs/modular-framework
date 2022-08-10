import {
    FILE_CREATE,
    FILE_DELETE_OWN,
    FILE_DOWNLOAD,
    FILE_SHOW_OWN,
    FILE_SHOW_PUBLIC,
    FILE_UPDATE_OWN
} from '../../modules/media/permissions/File'
import { USER_STORAGE_SHOW_OWN } from '../../modules/media/permissions/UserStorage'
import { permissions as userPermissions } from '@dracul/user-backend'

module.exports = {
    name: "uploader",
    permissions: [
        FILE_CREATE,
        FILE_SHOW_OWN,
        FILE_SHOW_PUBLIC,
        FILE_UPDATE_OWN,
        FILE_DELETE_OWN,
        USER_STORAGE_SHOW_OWN,
        FILE_DOWNLOAD,
        userPermissions.SECURITY_USER_SHOW,
        userPermissions.SECURITY_GROUP_SHOW
    ]
}
