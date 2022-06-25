const storeFile = require('./helpers/storeFile')
const randomString = require('./helpers/randomString')
const randomNumber = require('./helpers/randomNumber')
const createDirIfNotExist = require('./helpers/createDirIfNotExist')
const tempDir = require('./helpers/tempDir')
const {types} =  require('./graphql')
const mongoose = require('mongoose')

module.exports.tempDir = tempDir
module.exports.storeFile = storeFile
module.exports.randomString = randomString
module.exports.randomNumber = randomNumber
module.exports.createDirIfNotExist = createDirIfNotExist
module.exports.commonTypes = types
module.exports.mongoose = mongoose

