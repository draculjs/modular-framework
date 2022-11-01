import {DefaultLogger} from "@dracul/logger-backend";

import {
    CUSTOMIZATION_COLORS_UPDATE,
    CUSTOMIZATION_CREATE,
    CUSTOMIZATION_LANG_UPDATE,
    CUSTOMIZATION_LOGO_UPDATE,
    CUSTOMIZATION_SHOW,
    CUSTOMIZATION_UPDATE
} from "../permissions";

import {LIGHT_DEFAULT_THEME, DARK_DEFAULT_THEME} from '../constants/themes'
import {InitService} from "@dracul/user-backend";
import {createCustomization, findCustomization, updateColors} from "./CustomizationService";

export const initCustomization = async function ({lightTheme, darkTheme, logo, language}) {


    let data = {}

    data.lightTheme = lightTheme ? lightTheme : LIGHT_DEFAULT_THEME
    data.darkTheme = darkTheme ? darkTheme : DARK_DEFAULT_THEME
    data.logo = logo ? logo : {mode: 'OnlyTitle', title: 'APP'}
    data.language = language ? language : 'es'

    let customDoc = await findCustomization()

    if (!customDoc) {
        let customDoc = await createCustomization(data)
        DefaultLogger.info("Customization created. ID: ", customDoc._id)
    }

    else if(!customDoc?.lightTheme && !customDoc?.lightTheme?.primary){

        let lightTheme = customDoc.colors ? customDoc.colors : LIGHT_DEFAULT_THEME
        lightTheme.appBar = LIGHT_DEFAULT_THEME.appBar
        lightTheme.onAppBar = LIGHT_DEFAULT_THEME.onAppBar
        lightTheme.background = LIGHT_DEFAULT_THEME.background

        let darkTheme = DARK_DEFAULT_THEME
        await updateColors({lightTheme,darkTheme})

        DefaultLogger.debug("Customization Light Theme updated from colors. ID: ", customDoc._id)

    }

    else if(customDoc?.lightTheme && (!customDoc?.lightTheme?.appBar  || !customDoc?.lightTheme?.onAppBar || !customDoc?.lightTheme?.background)){


        let lightTheme = customDoc.lightTheme
        lightTheme.appBar =  lightTheme.appBar ? lightTheme.appBar : LIGHT_DEFAULT_THEME.appBar
        lightTheme.onAppBar =  lightTheme.onAppBar ? lightTheme.onAppBar : LIGHT_DEFAULT_THEME.onAppBar
        lightTheme.background =  lightTheme.background ? lightTheme.background : LIGHT_DEFAULT_THEME.background

        let darkTheme = customDoc.darkTheme
        darkTheme.appBar =  darkTheme.appBar ? darkTheme.appBar : DARK_DEFAULT_THEME.appBar
        darkTheme.onAppBar =  darkTheme.onAppBar ? darkTheme.onAppBar : DARK_DEFAULT_THEME.onAppBar
        darkTheme.background =  darkTheme.background ? darkTheme.background : DARK_DEFAULT_THEME.background

        await updateColors({lightTheme,darkTheme})

        DefaultLogger.debug("Customization appBar, onAppBar, Background Updated. ID: ", customDoc._id)
    }

    else {
        DefaultLogger.debug("Customization found. ID: ", customDoc._id)
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
