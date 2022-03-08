import {securityResolvers, securityTypes} from './graphql'

import {sessionMiddleware, jwtMiddleware, rbacMiddleware, corsMiddleware} from './middleware'

import {UserModel, UserSchema} from './models/UserModel'
import {RoleModel,RoleSchema} from './models/RoleModel'
import {GroupModel, GroupSchema} from './models/GroupModel'

import {
    AuthService,
    RecoveryService,
    RegisterService,
    GroupService,
    RoleService,
    UserService,
    UserAuditService,
    UserEmailManager,
    LoginFailService,
    SessionService,
    InitService,
    ProfileService,
    RbacService
} from './services'

import * as permissions from './permissions'

import rbac from './rbac/index'

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
    UserAuditService,
    UserEmailManager,
    LoginFailService,
    SessionService,
    InitService,
    ProfileService,
    RbacService,

    //permissions
    permissions
}

