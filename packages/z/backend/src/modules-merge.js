import { mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import { securityResolvers, securityTypes } from '@dracul/user-backend'

import { commonTypes } from '@dracul/common-backend'
import { types as customTypes, resolvers as customResolvers } from '@dracul/customize-backend'
import { types as notificationTypes, resolvers as notificationResolvers } from '@dracul/notification-backend'
import { types as settingsTypes, resolvers as settingsResolvers } from '@dracul/settings-backend'
import { types as mediaTypes, resolvers as mediaResolvers } from '@dracul/media-backend'
import { types as auditTypes, resolvers as auditResolvers } from '@dracul/audit-backend'

//BASE RESOLVERS
import { resolvers as baseResolvers } from './modules/base/graphql'
//BASE TYPEDEFS
import { types as baseTypes } from './modules/base/graphql'


export const resolvers = mergeResolvers([
    baseResolvers,
    securityResolvers,
    notificationResolvers,
    customResolvers,
    settingsResolvers,
    mediaResolvers,
    auditResolvers
])

export const typeDefs = mergeTypes([
    commonTypes,
    baseTypes,
    securityTypes,
    notificationTypes,
    customTypes,
    settingsTypes,
    mediaTypes,
    auditTypes
])
