import {resolvers, types} from './modules/media/graphql'
import * as FileService from './modules/media/services/FileService'
import * as UserStorageService from './modules/media/services/UserStorageService'
import {userStorageCheckAndCreate} from './modules/media/services/UserStorageService'
import fileUpload from './modules/media/services/UploadService'
import fileUploadAnonymous from './modules/media/services/UploadAnonymousService'
import InitMediaPermissions from './modules/media/services/InitMediaPermissions'
import * as filePermissions from './modules/media/permissions/File'
import * as userStoragePermissions from './modules/media/permissions/UserStorage'
import { userCreateListener } from './modules/media/listeners/UserCreateListener'
import { updateFileMiddleware } from "./modules/media/middleware"

import {
    findFile,
    fetchFiles,
    deleteFile,
    paginateFiles,
    updateFile
} from './modules/media/services/FileService'

export {
    types,
    resolvers,
    FileService,
    UserStorageService,
    userStorageCheckAndCreate,
    fileUpload,
    fileUploadAnonymous,
    InitMediaPermissions,
    userCreateListener,

    //Middleware
    updateFileMiddleware,

    //Permissions
    filePermissions,
    userStoragePermissions,

    //Services
    findFile,
    fetchFiles,
    deleteFile,
    paginateFiles,
    updateFile
}
