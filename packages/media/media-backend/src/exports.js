import {resolvers, types} from './modules/media/graphql'
import * as FileService from './modules/media/services/FileService'
import fileUpload from './modules/media/services/UploadService'
import InitMediaPermissions from './modules/media/services/InitMediaPermissions'
import * as filePermissions from './modules/media/permissions/File'

export {
    types,
    resolvers,
    FileService,
    fileUpload,
    InitMediaPermissions,
    filePermissions
}