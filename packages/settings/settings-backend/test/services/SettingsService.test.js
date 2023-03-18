import { findSettingsByKey, findSettingsByKeys, fetchSettings, getSettingsValueByKey} from "../../src";
import {expect} from 'chai'
import mongoInMemoryConnect from "../mongoInMemory";
import {initializeSettings} from "../init/settings.init";

describe("SettingsService", () => {


    beforeEach(async () => {
        await mongoInMemoryConnect()
        let settings = await fetchSettings()
        console.log("fetchSettings", settings)
        await initializeSettings()

        return true
    });

    it('getSettingsValueByKey stringSetting', async () => {
        let stringSetting = await getSettingsValueByKey('name')

        console.log("name",stringSetting)
        expect(stringSetting).equal("John")
    });

    it('getSettingsValueByKey numberSetting', async () => {
        let numberSetting = await getSettingsValueByKey('age')

        console.log("age",numberSetting)
        expect(numberSetting).equal(37)
    });

    it('getSettingsValueByKey booleanSetting', async () => {
        let booleanSetting = await getSettingsValueByKey('extraordinary')

        console.log("booleanSetting",booleanSetting)
        expect(booleanSetting).equal(true)
    });

    it('findSettingsByKey', async () => {
        let setting = await findSettingsByKey('pricePerKm')

        console.log("Setting",setting)
        expect(setting.key).equal('pricePerKm')
        expect(setting.value).equal("1")
        return
    });


    it('findSettingsByKeys', async () => {
        let {pricePerKm, minCost} = await findSettingsByKeys(['pricePerKm','minCost'])

        expect(pricePerKm.key).equal('pricePerKm')
        expect(pricePerKm.value).equal("1")

        expect(minCost.key).equal('minCost')
        expect(minCost.value).equal("2")
        return
    });

})
