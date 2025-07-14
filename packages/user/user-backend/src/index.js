import {resolvers as securityResolvers, types as securityTypes} from './graphql/index.js'

import {sessionMiddleware, jwtMiddleware, rbacMiddleware, corsMiddleware} from './middleware/index.js'

import {UserModel, UserSchema} from './models/UserModel.js'
import {RoleModel,RoleSchema} from './models/RoleModel.js'
import {GroupModel, GroupSchema} from './models/GroupModel.js'

import {
    AuthService,
    RecoveryService,
    RegisterService,
    GroupService,
    RoleService,
    UserService,
    UserEmailManager,
    LoginFailService,
    SessionService,
    InitService,
    ProfileService,
    RbacService
} from './services/index.js'

import * as permissions from './permissions/include/security-permissions.js'

import rbac from './rbac/index.js'

import { nonPrivilegedRolesReadOnly } from './services/InitService.js'

export {
    //Models
    UserModel,
    RoleModel,
    GroupModel,

    //Schemas
    UserSchema,
    RoleSchema,
    GroupSchema,

    //rbac
    rbac,

    //Graphql
    securityResolvers,
    securityTypes,

    //Middlewares
    sessionMiddleware,
    jwtMiddleware,
    rbacMiddleware,
    corsMiddleware,

    //Services
    AuthService,
    RecoveryService,
    RegisterService,
    GroupService,
    RoleService,
    UserService,
    UserEmailManager,
    LoginFailService,
    SessionService,
    InitService,
    ProfileService,
    RbacService,

    //permissions
    permissions,
    nonPrivilegedRolesReadOnly
}

