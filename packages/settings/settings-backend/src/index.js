//Graphql: types & resolvers
import {types, resolvers} from "./graphql"
//Models
import SettingsModel  from "./models/SettingsModel"
//Permissions
import * as permissions from "./permissions/Settings"
//Services
import {
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
    initializeSetting
} from "./services/SettingsService"

import SettingCache from "./cache/SettingCache";

export {
    //Types and resolvers
    types,
    resolvers,
    //Model
    SettingsModel,
    //permissions
    permissions,
    //Services
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
