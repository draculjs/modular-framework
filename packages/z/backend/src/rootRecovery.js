require('dotenv').config();

import {DefaultLogger as winston} from '@dracul/logger-backend';
const mongoConnect = require('./mongo-db')

const {UserService} = require('@dracul/user-backend')

const rootRecovery = async () => {
    try {
        await mongoConnect()
        const root = await UserService.recoveryRootUser()
        winston.debug('rootRecovery sucessfull')
        console.log(root)
    } catch (error) {
        winston.error('rootRecovery error ', error)
    }
    process.exit()
}

rootRecovery()