import {DefaultLogger} from "@dracul/logger-backend";

import {
    CUSTOMIZATION_COLORS_UPDATE,
    CUSTOMIZATION_CREATE,
    CUSTOMIZATION_LANG_UPDATE,
    CUSTOMIZATION_LOGO_UPDATE,
    CUSTOMIZATION_SHOW,
    CUSTOMIZATION_UPDATE
} from "../permissions";
import {InitService} from "@dracul/user-backend";
import {createCustomization, findCustomization} from "./CustomizationService";

export const initCustomization = async function () {

    let customDoc = await findCustomization()

    if (!customDoc) {
        let customDoc = await createCustomization({
            colors: {
                primary: '#3F51B5',
                onPrimary: '#FFFFFF',
                secondary: '#1565C0',
                onSecondary: '#FFFFFF'
            },
            logo: {
                mode: 'OnlyTitle',
                title: 'APP'
            },
            language: 'en'
        })
        DefaultLogger.info("customization created: ", customDoc.id)
    } else {
        DefaultLogger.debug("customization found: ", customDoc.id)
    }

}
export const initPermissionsCustomization = async function () {
    let permissions = [
        CUSTOMIZATION_SHOW,
        CUSTOMIZATION_CREATE,
        CUSTOMIZATION_UPDATE,
        CUSTOMIZATION_COLORS_UPDATE,
        CUSTOMIZATION_LANG_UPDATE,
        CUSTOMIZATION_LOGO_UPDATE]
    await InitService.initPermissions(permissions)
}