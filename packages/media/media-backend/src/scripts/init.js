import dotenv from 'dotenv'

dotenv.config()
import mongoose from 'mongoose'

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.set('useCreateIndex', true)

import { InitService } from '@dracul/user-backend'
import { initCustomization, initPermissionsCustomization } from '@dracul/customize-backend'

//FILES
import { initMediaPermissions } from "../modules/media/services/InitMediaPermissions";

const init = async () => {
    await InitService.initPermissions()
    await initPermissionsCustomization()

    await initMediaPermissions()

    await InitService.initAdminRole()
    await updateAdminRole()
    await InitService.initRoles()
    await InitService.initRootUser()
    await initCustomization()
    console.log("Done")
    process.exit()
}

init()