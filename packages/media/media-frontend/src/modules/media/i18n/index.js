import merge from 'deepmerge'

import FileMessages from './messages/FileMessages'
import UserStorageMessages from './messages/UserStorageMessages'
import ExtraMessages from './messages/ExtraMessages'

import FilePermissionMessages from './permissions/FilePermissionMessages'
import UserStoragePermissionMessages from './permissions/UserStoragePermissionMessages'


const messages = merge.all([
    FileMessages,
    UserStorageMessages,
    ExtraMessages,

    FilePermissionMessages,
    UserStoragePermissionMessages
])

export default messages;
