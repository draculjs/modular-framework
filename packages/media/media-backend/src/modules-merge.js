import {mergeTypes, mergeResolvers} from 'merge-graphql-schemas';
import {securityResolvers,securityTypes} from '@dracul/user-backend'
import {commonTypes} from '@dracul/common-backend'
import {types as customTypes,resolvers as customResolvers} from '@dracul/customize-backend'

//BASE RESOLVERS
import {resolvers as baseResolvers } from './modules/base/graphql'
import {resolvers as mediaResolvers } from './modules/media/graphql'
//BASE TYPEDEFS
import {types as baseTypes} from './modules/base/graphql'
import {types as mediaTypes} from './modules/media/graphql'

export const resolvers = mergeResolvers([
    baseResolvers,
    securityResolvers,
    customResolvers,
    mediaResolvers
])

export const typeDefs = mergeTypes([
    commonTypes,
    baseTypes,
    securityTypes,
    customTypes,
    mediaTypes
])
