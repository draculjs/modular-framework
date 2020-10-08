import {
    findCustomization,
    createCustomization,
    updateCustomization,
    updateColors,
    updateLang,
    updateLogo,
    uploadLogo,
    initCustomization,
    initPermissionsCustomization
} from "./services/CustomizationService";
import * as permissions from './permissions'
import {types, resolvers} from './graphql'

export {
    //permissions
    permissions,

    //Graphql
    types,
    resolvers,

    //Services
    findCustomization,
    createCustomization,
    updateCustomization,
    updateColors,
    updateLang,
    updateLogo,
    uploadLogo,
    initCustomization,
    initPermissionsCustomization
}