import {initSettings} from "../InitSettings";
import {createSettings, findSettingsByKey, findSettingsByKeys, fetchSettings} from "../../src";
import {expect} from 'chai'
import mongoInMemoryConnect from "../mongoInMemory";

describe("SettingsService", () => {


    beforeEach(async () => {
        await mongoInMemoryConnect()
        let settings = await fetchSettings()
        console.log("fetchSettings", settings)
        for(let setting of initSettings){
            await createSettings(null, setting)
        }

        return true
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
