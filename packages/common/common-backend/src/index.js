const storeFile = require('./helpers/storeFile')
const randomString = require('./helpers/randomString')
const randomNumber = require('./helpers/randomNumber')
const createDirIfNotExist = require('./helpers/createDirIfNotExist')
import {types as commonTypes} from './graphql'

module.exports.storeFile = storeFile
module.exports.randomString = randomString
module.exports.randomNumber = randomNumber
module.exports.createDirIfNotExist = createDirIfNotExist
module.exports.commonTypes = commonTypes

