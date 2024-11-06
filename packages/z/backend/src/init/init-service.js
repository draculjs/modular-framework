import dotenv from 'dotenv'
dotenv.config()

import {InitService} from '@dracul/user-backend'
import {initPermissionsCustomization, initCustomization} from '@dracul/customize-backend'
import operatorRole from './custom/initOperatorRole'
import managerRole from './custom/initManagerRole'
import desarrolloRole from './custom/initDesarrolloRole'

import {
    permissions as notiPermissions
} from "@dracul/notification-backend"

import {
    permissions as settingsPermissions
} from '@dracul/settings-backend'

import {
    InitMediaPermissions,
    userStorageCheckAndCreate
} from '@dracul/media-backend'


import {
    permissions as AuditPermissions
} from "@dracul/audit-backend"

import {initSettings} from './custom/initSettings'
import {testNotification} from './custom/testNotification'

import modulesPermissions from './custom/modulesPermissions'

const initService = async () => {
    console.log("INIT SERVICE")

    await InitService.initLdapSettings()
    //Default user Permissions
    await InitService.initPermissions()

    //Dracul Media Permissions
    await InitMediaPermissions()
    await userStorageCheckAndCreate()

    //Notification permissions
    await InitService.initPermissions([
        notiPermissions.NOTIFICATION_SHOW,
        notiPermissions.NOTIFICATION_CREATE,
        notiPermissions.NOTIFICATION_UPDATE
    ])

    //Settings Permissions
    await InitService.initPermissions([
        settingsPermissions.SETTINGS_CREATE,
        settingsPermissions.SETTINGS_UPDATE,
        settingsPermissions.SETTINGS_DELETE,
        settingsPermissions.SETTINGS_SHOW,
    ])

    await InitService.initPermissions([
        AuditPermissions.AUDIT_SHOW,
        AuditPermissions.AUDIT_MENU,
    ])

    //Init settings
    await initSettings()

    //Dracul Customization module Permissions
    await initPermissionsCustomization()

    //Custom Module permissions
    await InitService.initPermissions(modulesPermissions)

    await InitService.initAdminRole()

    await InitService.initRoles([operatorRole, managerRole, desarrolloRole])

    await InitService.initRootUser()
    await InitService.initOperatorUser()

    await testNotification()

    await initCustomization({})
}

export {initService}

export default initService
