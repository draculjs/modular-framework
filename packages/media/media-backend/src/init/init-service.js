import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.set('useCreateIndex', true)

import { InitService } from '@dracul/user-backend'
import { initPermissionsCustomization } from '@dracul/customize-backend'
import { initCustomization } from './custom/initCustomization'
import uploaderRole from './custom/initUploaderRole'
import visualizerRole from './custom/initVisualizerRole';
import initMediaPermissions from '../modules/media/services/InitMediaPermissions'
import { userStorageCheckAndCreate } from '../modules/media/services/UserStorageService'

const initService = async () => {
    await InitService.initPermissions()

    await initPermissionsCustomization()
    await initMediaPermissions()
    // await userStorageCheckAndCreate()

    await InitService.initAdminRole()
    await InitService.initRoles([uploaderRole, visualizerRole])
    await InitService.initRootUser()

    await initCustomization()
}

export { initService }

export default initService
