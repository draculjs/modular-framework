import mongoInMemoryConnect from "../mongoInMemory";
import {initializeSettings} from "../init/settings.init";
import {expect} from 'chai'
import SettingCache from "../../src/cache/SettingCache";
import {
    createSettings,
    findSettingsByKey,
    findSettingsByKeys,
    fetchSettings,
    updateSettings,
    getSettingsValueByKey
} from "../../src";
import {updateSettingsByKey} from "../../src/services/SettingsService";


const sleep = (seconds) => {
    return new Promise((resolve) => {
        setTimeout(()=> resolve(), seconds * 1000)
    })
}

describe("SettingCache", () => {


    beforeEach(async () => {
        await mongoInMemoryConnect()
        await initializeSettings()
    });

    afterEach(async () => {

    })


    it('GET CACHE SETTING', async () => {

        let name = await SettingCache('name',3)
        let age = await SettingCache('age',3)
        let extraordinary = await SettingCache('extraordinary',3)

        expect(name).equal('John')
        expect(age).equal('37')
        expect(extraordinary).equal("true")

        await updateSettingsByKey(null, {key: 'name', value:'Cristian'})
        await updateSettingsByKey(null, {key: 'age', value: 38})
        await updateSettingsByKey(null, {key: 'extraordinary', value: false})

        let nameCache = await SettingCache('name',3)
        let ageCache = await SettingCache('age',3)
        let extraordinaryCache = await SettingCache('extraordinary',3)

        expect(nameCache).equal('John')
        expect(ageCache).equal('37')
        expect(extraordinaryCache).equal("true")

        let nameDb = await getSettingsValueByKey('name')
        let ageDb = await getSettingsValueByKey('age')
        let extraordinaryDB = await getSettingsValueByKey('extraordinary')

        expect(nameDb).equal('Cristian')
        expect(ageDb).equal('38')
        expect(extraordinaryDB).equal("false")


        await sleep(5)

        let nameCache2 = await SettingCache('name',3)
        let ageCache2 = await SettingCache('age',3)
        let extraordinaryCache2 = await SettingCache('extraordinary',3)

        expect(nameCache2).equal('Cristian')
        expect(ageCache2).equal('38')
        expect(extraordinaryCache2).equal("false")

    });

})
