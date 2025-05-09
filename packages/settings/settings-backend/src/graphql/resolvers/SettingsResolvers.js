import {
    findSettings,
    fetchSettings,
    paginateSettings,
    findSettingsByKey,
    updateSettingsByKey,
    fetchEntityOptions,
    fetchSettingsGroup
} from '../../services/SettingsService'

import {AuthenticationError, ForbiddenError} from "apollo-server-errors";

import {

    SETTINGS_SHOW,
    SETTINGS_UPDATE
} from "../../permissions/Settings";

export default {
    Query: {
        settingsFind: (_, {id}, __) => {
            return findSettings(id)
        },
        settingsFindByKey: (_, {key}, __) => {
            return findSettingsByKey(key)
        },
        settingsFetch: (_, {}, __) => {
            return fetchSettings()
        },
        settingsPaginate: (_, {pageNumber, itemsPerPage, search, orderBy, orderDesc}, {user, rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!rbac.isAllowed(user.id, SETTINGS_SHOW)) throw new ForbiddenError("Not Authorized")
            return paginateSettings(pageNumber, itemsPerPage, search, orderBy, orderDesc)
        },
        fetchEntityOptions(_, {key}, __) {
            return fetchEntityOptions(key)
        },
        async fetchSettingsGroup(){
            return await fetchSettingsGroup()
        }

    },
    Mutation: {
        settingValueUpdateByKey: (_, {key, value, valueList}, {user, rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!rbac.isAllowed(user.id, SETTINGS_UPDATE)) throw new ForbiddenError("Not Authorized")
            return updateSettingsByKey(user, {key,value, valueList})
        }
    }

}

