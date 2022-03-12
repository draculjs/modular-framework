import dotenv from 'dotenv'
dotenv.config()

import initService from "./init/init-service";


initService().then(()=>{
    process.exit()
})