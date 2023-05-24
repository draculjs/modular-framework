import SettingsModel from "../../src/models/SettingsModel";
import {SETTING_STRING, SETTING_NUMBER, SETTING_BOOLEAN, SETTING_NUMBERLIST} from "../data/settings.data";


export const initializeSettings = async () => {
    console.log("initializeSettings START")
    //console.log("SETTINGS",SETTING_STRING, SETTING_NUMBER, SETTING_BOOLEAN)
    await SettingsModel.create(SETTING_STRING)
    await SettingsModel.create(SETTING_NUMBER)
    await SettingsModel.create(SETTING_BOOLEAN)
    await SettingsModel.create(SETTING_NUMBERLIST)
    console.log('initializeSettings end')

}
