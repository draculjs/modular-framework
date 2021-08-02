//Graphql: types & resolvers
import {types, resolvers} from "./graphql"
//Models
import SettingsModel  from "./models/SettingsModel"
//Permissions
import * as permissions from "./permissions/Settings"
//Services
import {
    findSettingsByKey,
    findSettings,
    fetchSettings,
    createSettings,
    updateSettings,
    paginateSettings,
    deleteSettings
} from "./services/SettingsService"

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
    findSettings,
    fetchSettings,
    createSettings,
    updateSettings,
    paginateSettings,
    deleteSettings
}
