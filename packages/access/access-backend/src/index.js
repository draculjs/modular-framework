import { requireAuthentication, requireAuthorization } from "./middlewares/authMiddleware.js"
import { cors as corsMiddleware } from "./middlewares/corsMiddleware.js"
import { whitelistIp as whitelistIpMiddleware } from "./middlewares/whitelistIpMiddleware.js"

import { types, resolvers } from './graphql/index.js'

import domainPermissions from './permissions/DomainPermissions.js'
import ipPermissions from './permissions/IpPermissions.js'
import accessPermissions from './permissions/AccessPermissions.js'

export {
    //middlewares
    corsMiddleware,
    whitelistIpMiddleware,
    requireAuthentication,
    requireAuthorization,
    
    //graphql
    types,
    resolvers,

    //permissions
    domainPermissions,
    ipPermissions,
    accessPermissions
}