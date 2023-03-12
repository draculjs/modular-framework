import mongoInMemoryConnect from "../mongoInMemory";
import {initializeSettings} from "../init/settings.init";
import {expect} from 'chai'
import SettingCache from "../../src/cache/SettingCache";
import {findSettingsByKey, getSettingsValueByKey} from "../../src";
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
        let numberList = await SettingCache('numberList',3)

        expect(name).equal('John')
        expect(age).equal(37)
        expect(extraordinary).equal("true")
        expect(numberList[0]).equal(1)
        expect(numberList[1]).equal(2)
        expect(numberList[2]).equal(3)

        await updateSettingsByKey(null, {key: 'name', value:'Cristian'})
        await updateSettingsByKey(null, {key: 'age', value: 38})
        await updateSettingsByKey(null, {key: 'extraordinary', value: false})
        await updateSettingsByKey(null, {key: 'numberList', valueList: [4,5,6]})

        let nameCache = await SettingCache('name',3)
        let ageCache = await SettingCache('age',3)
        let extraordinaryCache = await SettingCache('extraordinary',3)
        let numberListCache = await SettingCache('numberList',3)

        expect(nameCache).equal('John')
        expect(ageCache).equal(37)
        expect(extraordinaryCache).equal("true")
        expect(numberListCache[0]).equal(1)
        expect(numberListCache[1]).equal(2)
        expect(numberListCache[2]).equal(3)

        let nameDb = await getSettingsValueByKey('name')
        let ageDb = await getSettingsValueByKey('age')
        let extraordinaryDB = await getSettingsValueByKey('extraordinary')
        let numberListDB = await getSettingsValueByKey('numberList')

        expect(nameDb).equal('Cristian')
        expect(ageDb).equal(38)
        expect(extraordinaryDB).equal("false")
        expect(numberListDB[0]).equal(4)
        expect(numberListDB[1]).equal(5)
        expect(numberListDB[2]).equal(6)


        await sleep(5)

        let nameCache2 = await SettingCache('name',3)
        let ageCache2 = await SettingCache('age',3)
        let extraordinaryCache2 = await SettingCache('extraordinary',3)
        let numberListCache2 = await SettingCache('numberList',3)

        expect(nameCache2).equal('Cristian')
        expect(ageCache2).equal(38)
        expect(extraordinaryCache2).equal("false")
        expect(numberListCache2[0]).equal(4)
        expect(numberListCache2[1]).equal(5)
        expect(numberListCache2[2]).equal(6)

    });

})
