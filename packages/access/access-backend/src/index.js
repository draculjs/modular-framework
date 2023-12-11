import { requireAuthentication, requireAuthorization } from "./middlewares/authMiddleware"
import { cors as corsMiddleware } from "./middlewares/corsMiddleware"
import { whitelistIp as whitelistIpMiddleware } from "./middlewares/whitelistIpMiddleware"

import { types, resolvers } from './graphql'

import domainPermissions from './permissions/DomainPermissions'
import ipPermissions from './permissions/IpPermissions'
import accessPermissions from './permissions/AccessPermissions'

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