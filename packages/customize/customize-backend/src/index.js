import {
    findCustomization, createCustomization, updateCustomization, updateColors, updateLang, updateLogo, uploadLogo
} from "./services/CustomizationService.js";
import * as permissions from './permissions/index.js'
import {types, resolvers} from './graphql/index.js'
import {initCustomization, initPermissionsCustomization} from "./services/InitCustomizationService.js";

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