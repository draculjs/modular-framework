//Graphql: types & resolvers
import {types, resolvers} from "./graphql/index.js"
//Models
import SettingsModel  from "./models/SettingsModel.js"
//Permissions
import * as permissions from "./permissions/Settings.js"
//Services
import {
    findSettingsByKey,
    findSettingsByKeys,
    getSettingsValueByKey,
    findSettings,
    fetchSettings,
    createSettings,
    createOrUpdateSettings,
    updateSettings,
    updateSettingsByKey,
    paginateSettings,
    deleteSettings,
    initializeSettings,
    initializeSetting
} from "./services/SettingsService.js"

import SettingCache from "./cache/SettingCache.js";

export {
    //Types and resolvers
    types,
    resolvers,
    //Model
    SettingsModel,
    //permissions
    permissions,
    //Services
    createOrUpdateSettings,
    findSettingsByKey,
    findSettingsByKeys,
    getSettingsValueByKey,
    findSettings,
    fetchSettings,
    createSettings,
    updateSettings,
    updateSettingsByKey,
    paginateSettings,
    deleteSettings,
    initializeSettings,
    initializeSetting,
    //CACHE
    SettingCache
}
