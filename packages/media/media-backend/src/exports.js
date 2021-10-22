import {resolvers, types} from './modules/media/graphql'
import * as FileService from './modules/media/services/FileService'
import fileUpload from './modules/media/services/UploadService'
import fileUploadAnonymous from './modules/media/services/UploadAnonymousService'
import InitMediaPermissions from './modules/media/services/InitMediaPermissions'
import * as filePermissions from './modules/media/permissions/File'

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
    fileUpload,
    fileUploadAnonymous,
    InitMediaPermissions,
    filePermissions,
    //Services
    findFile,
    fetchFiles,
    deleteFile,
    paginateFiles,
    updateFile
}
