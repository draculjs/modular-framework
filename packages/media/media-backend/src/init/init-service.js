import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
mongoose.set('useCreateIndex', true)

import {InitService} from '@dracul/user-backend'
import {initPermissionsCustomization} from '@dracul/customize-backend'
import {initCustomization} from './custom/initCustomization'
import operatorRole from './custom/initOperatorRole'
import { FILE_SHOW, FILE_UPDATE, FILE_CREATE, FILE_DELETE } from '../modules/media/permissions/File'

const initService = async () => {
    await InitService.initPermissions()
    await InitService.initPermissions([FILE_SHOW, FILE_UPDATE, FILE_CREATE, FILE_DELETE])
    await initPermissionsCustomization()

    await InitService.initAdminRole()
    await InitService.initOperatorRole()
    await InitService.initSupervisorRole()

    await InitService.initRoles([operatorRole])

    await InitService.initRootUser()
    await InitService.initSupervisorUser()
    await InitService.initOperatorUser()

    await initCustomization()
}

export {initService}

export default initService
