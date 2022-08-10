import merge from 'deepmerge'

import SettingMessage from './messages/SettingMessage'

import SettingPermissionMessages from './permissions/SettingPermissionMessages'


const messages = merge.all([
    SettingMessage,
    SettingPermissionMessages
])

export default messages;
