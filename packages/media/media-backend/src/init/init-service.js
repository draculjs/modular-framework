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
import initMediaPermissions from '../modules/media/services/InitMediaPermissions';

const initService = async () => {
    await InitService.initPermissions()
    await initPermissionsCustomization()
    await initMediaPermissions()
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
