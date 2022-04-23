import {initSettings} from "../InitSettings";
import {createSettings, findSettingsByKey, findSettingsByKeys} from "../../src";
import {expect} from 'chai'

describe("SettingsService", () => {


    beforeEach(async () => {
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
    });


    it('findSettingsByKeys', async () => {
        let {pricePerKm, minCost} = await findSettingsByKeys(['pricePerKm','minCost'])

        expect(pricePerKm.key).equal('pricePerKm')
        expect(pricePerKm.value).equal("1")

        expect(minCost.key).equal('minCost')
        expect(minCost.value).equal("2")
    });

})
