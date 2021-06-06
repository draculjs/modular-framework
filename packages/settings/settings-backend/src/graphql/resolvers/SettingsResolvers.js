import {
    createSettings,
    updateSettings,
    deleteSettings,
    findSettings,
    fetchSettings,
    paginateSettings,
    findSettingsByKey
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
        settingsFind: (_, {id}, {user, rbac}) => {
            //  if (!user) throw new AuthenticationError("Unauthenticated")
            //  if(!rbac.isAllowed(user.id, SETTINGS_SHOW)) throw new ForbiddenError("Not Authorized")
            return findSettings(id)
        },
        settingsFindByKey: (_, {Key}, {user, rbac}) => {
            //  if (!user) throw new AuthenticationError("Unauthenticated")
            //  if(!rbac.isAllowed(user.id, SETTINGS_SHOW)) throw new ForbiddenError("Not Authorized")
            return findSettingsByKey(key)
        },
        settingsFetch: (_, {}, {user, rbac}) => {
            //   if (!user) throw new AuthenticationError("Unauthenticated")
            //  if(!rbac.isAllowed(user.id, SETTINGS_SHOW)) throw new ForbiddenError("Not Authorized")
            return fetchSettings()
        },
        settingsPaginate: (_, {pageNumber, itemsPerPage, search, orderBy, orderDesc}, {user, rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!rbac.isAllowed(user.id, SETTINGS_SHOW)) throw new ForbiddenError("Not Authorized")
            return paginateSettings(pageNumber, itemsPerPage, search, orderBy, orderDesc)
        },

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
        settingsDelete: (_, {id}, {user, rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!rbac.isAllowed(user.id, SETTINGS_DELETE)) throw new ForbiddenError("Not Authorized")
            return deleteSettings(id)
        },
    }

}

