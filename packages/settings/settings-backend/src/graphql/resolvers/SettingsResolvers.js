import {
    findSettings,
    fetchSettings,
    paginateSettings,
    findSettingsByKey,
    updateSettingsByKey,
    fetchEntityOptions
} from '../../services/SettingsService'

import {AuthenticationError, ForbiddenError} from "apollo-server-express";

import {

    SETTINGS_SHOW,
    SETTINGS_UPDATE
} from "../../permissions/Settings";

export default {
    Query: {
        settingsFind: (_, {id}, __) => {
            return findSettings(id)
        },
        settingsFindByKey: (_, {Key}, __) => {
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
        }

    },
    Mutation: {
        settingValueUpdateByKey: (_, {key, value}, {user, rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!rbac.isAllowed(user.id, SETTINGS_UPDATE)) throw new ForbiddenError("Not Authorized")
            return updateSettingsByKey(user, {key,value})
        }
    }

}

