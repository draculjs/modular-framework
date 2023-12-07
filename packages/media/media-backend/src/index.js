import {resolvers, types} from './graphql'

import * as FileService from './services/FileService'
import * as UserStorageService from './services/UserStorageService'

import {userStorageCheckAndCreate} from './services/UserStorageService'
import fileUpload from './services/UploadService'
import fileUploadAnonymous from './services/UploadAnonymousService'
import InitMediaPermissions from './services/InitMediaPermissions'
import * as filePermissions from './permissions/File'
import * as userStoragePermissions from './permissions/UserStorage'
import { userCreateListener } from './listeners/UserCreateListener'
import { updateFileMiddleware } from "./middleware"
import FileRouter from "./rest/routers/FileRouter"
import usersStorageRouter from "./rest/routers/UsersStorageRouter.js"

import {
    findFile,
    fetchFiles,
    deleteFile,
    paginateFiles,
    updateFile
} from './services/FileService'

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

    //API ROUTES
    FileRouter,
    usersStorageRouter,

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
