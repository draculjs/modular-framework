import SettingsModel from "../../src/models/SettingsModel";
import {SETTING1, SETTING2, SETTING3} from "../data/settings.data";


export const initializeSettings = async () => {
    console.log("initializeSettings START")
    //console.log("SETTINGS",SETTING1, SETTING2, SETTING3)
    await SettingsModel.create(SETTING1)
    await SettingsModel.create(SETTING2)
    await SettingsModel.create(SETTING3)
    console.log('initializeSettings end')

}
