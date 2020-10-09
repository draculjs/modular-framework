import {
    findCustomization,
    createCustomization,
    updateCustomization,
    updateColors,
    updateLang,
    updateLogo,
    uploadLogo
} from "./services/CustomizationService";
import * as permissions from './permissions'
import {types, resolvers} from './graphql'
import {initCustomization, initPermissionsCustomization} from "./services/InitCustomizationService";

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