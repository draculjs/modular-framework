import {
    createSettings,
    updateSettings,
    deleteSettings,
    findSettings,
    fetchSettings,
    paginateSettings,
    findSettingsByKey,
    updateSettingsByKey,
    fetchEntityFieldValues
} from '../../services/SettingsService'

import {AuthenticationError, ForbiddenError} from "apollo-server-express";

import {

    SETTINGS_SHOW,
    SETTINGS_UPDATE,
    SETTINGS_CREATE,
    SETTINGS_DELETE
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
        fetchEntityFieldValues(_, {entity, field}, __) {
            return fetchEntityFieldValues(entity, field)
        }

    },
    Mutation: {
        settingsCreate: (_, {input}, {user, rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!rbac.isAllowed(user.id, SETTINGS_CREATE)) throw new ForbiddenError("Not Authorized")
            return createSettings(user, input)
        },
        settingsUpdate: (_, {id, input}, {user, rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!rbac.isAllowed(user.id, SETTINGS_UPDATE)) throw new ForbiddenError("Not Authorized")
            return updateSettings(user, id, input)
        },
        settingValueUpdateByKey: (_, {key, value}, {user, rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!rbac.isAllowed(user.id, SETTINGS_UPDATE)) throw new ForbiddenError("Not Authorized")
            return updateSettingsByKey(user, {key,value})
        },
        settingsDelete: (_, {id}, {user, rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!rbac.isAllowed(user.id, SETTINGS_DELETE)) throw new ForbiddenError("Not Authorized")
            return deleteSettings(id)
        },
    }

}

