
import {
    createCustomization,
    updateCustomization,
    findCustomization,
    updateColors,
    updateLang,
    updateLogo,
    uploadLogo
} from '../../services/CustomizationService'
import {AuthenticationError, ForbiddenError} from "apollo-server-errors";
import {
    CUSTOMIZATION_CREATE,
    CUSTOMIZATION_UPDATE,
    CUSTOMIZATION_COLORS_UPDATE,
    CUSTOMIZATION_LANG_UPDATE,
    CUSTOMIZATION_LOGO_UPDATE
} from "../../permissions";

export default {
    Query: {
        customization: (_, {id}, {user,rbac}) => {
            return findCustomization()
        },
    },
    Mutation: {
        customizationCreate: (_, {input}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, CUSTOMIZATION_CREATE)) throw new ForbiddenError("Not Authorized")
            return createCustomization(input)
        },
          customizationUpdate: (_, {input}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, CUSTOMIZATION_UPDATE)) throw new ForbiddenError("Not Authorized")
            return updateCustomization(input)
        },

        colorsUpdate: (_, {input}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, CUSTOMIZATION_COLORS_UPDATE)) throw new ForbiddenError("Not Authorized")
            return updateColors(input)
        },

        logoUpdate: (_, {input}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, CUSTOMIZATION_LOGO_UPDATE)) throw new ForbiddenError("Not Authorized")
            return updateLogo(input)
        },

        langUpdate: (_, {input}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, CUSTOMIZATION_LANG_UPDATE)) throw new ForbiddenError("Not Authorized")
            return updateLang(input)
        },

        logoUpload: (_, {file}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, CUSTOMIZATION_LOGO_UPDATE)) throw new ForbiddenError("Not Authorized")
            return uploadLogo(file)
        },

    }

}

