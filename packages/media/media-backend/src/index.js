import { resolvers, types } from './graphql/index.js'

import FileService from './services/FileService.js'
import * as UserStorageService from './services/UserStorageService.js'

import { userStorageCheckAndCreate } from './services/UserStorageService.js'
import fileUpload from './services/UploadService.js'
import fileUploadAnonymous from './services/UploadAnonymousService.js'
import InitMediaPermissions from './services/InitMediaPermissions.js'
import * as filePermissions from './permissions/File.js'
import * as userStoragePermissions from './permissions/UserStorage.js'
import userCreateListener from './listeners/UserCreateListener.js'
import { updateFileMiddleware } from "./middleware/index.js"
import FileRouter from "./rest/routers/FileRouter.js"
import usersStorageRouter from "./rest/routers/UsersStorageRouter.js"

import { swaggerUiMiddleware, swaggerUiOptions } from './rest/swagger.js'

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

    //Swagger docs middleware
    swaggerUiMiddleware,
    swaggerUiOptions,
}
