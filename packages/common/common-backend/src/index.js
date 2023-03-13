const storeFile = require('./helpers/storeFile')
const randomString = require('./helpers/randomString')
const randomNumber = require('./helpers/randomNumber')
const createDirIfNotExist = require('./helpers/createDirIfNotExist')
const tempDir = require('./helpers/tempDir')

const filterQuery = require('./query/filterQuery')
const searchQuery = require('./query/searchQuery')
const sortQuery = require('./query/sortQuery')
const CustomApolloError = require('./errors/CustomApolloError')

const {types, resolvers} =  require('./graphql')
const mongoose = require('mongoose')

module.exports.tempDir = tempDir
module.exports.storeFile = storeFile
module.exports.randomString = randomString
module.exports.randomNumber = randomNumber
module.exports.createDirIfNotExist = createDirIfNotExist

module.exports.filterQuery = filterQuery
module.exports.searchQuery = searchQuery
module.exports.sortQuery = sortQuery

module.exports.commonTypes = types
module.exports.commonResolvers = resolvers
module.exports.mongoose = mongoose
module.exports.CustomApolloError = CustomApolloError
