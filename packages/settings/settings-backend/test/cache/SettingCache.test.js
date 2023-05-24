import mongoInMemoryConnect from "../mongo-in-memory";
import {initializeSettings} from "../init/settings.init";
import {expect} from 'chai'
import SettingCache from "../../src/cache/SettingCache";
import {updateSettingsByKey, getSettingsValueByKey} from "../../src/services/SettingsService";


const sleep = (seconds) => {
    return new Promise((resolve) => {
        setTimeout(()=> resolve(), seconds * 1000)
    })
}

describe("SettingCache", () => {


    beforeEach(async () => {
        await mongoInMemoryConnect.connect()
        await initializeSettings()
    });

    afterEach(async () => {
        await mongoInMemoryConnect.disconnect()
    })


    it('GET CACHE SETTING', async () => {

        let name = await SettingCache('name',3)
        let age = await SettingCache('age',3)
        let theBoolean = await SettingCache('TheBoolean',3)
        let numberList = await SettingCache('TheNumberList',3)

        expect(name).equal('John')
        expect(age).equal(37)
        expect(theBoolean).equal(true)
        expect(numberList[0]).equal(1)
        expect(numberList[1]).equal(2)
        expect(numberList[2]).equal(3)

        await updateSettingsByKey(null, {key: 'name', value:'Cristian'})
        await updateSettingsByKey(null, {key: 'age', value: 38})
        await updateSettingsByKey(null, {key: 'TheBoolean', value: null})
        await updateSettingsByKey(null, {key: 'TheNumberList', valueList: [4,5,6]})

        let nameCache = await SettingCache('name',3)
        let ageCache = await SettingCache('age',3)
        let theBooleanCache = await SettingCache('TheBoolean',3)
        let numberListCache = await SettingCache('TheNumberList',3)

        expect(nameCache).equal('John')
        expect(ageCache).equal(37)
        expect(theBooleanCache).equal(true)
        expect(numberListCache[0]).equal(1)
        expect(numberListCache[1]).equal(2)
        expect(numberListCache[2]).equal(3)

        let nameDb = await getSettingsValueByKey('name')
        let ageDb = await getSettingsValueByKey('age')
        let theBooleanDB = await getSettingsValueByKey('TheBoolean')
        let numberListDB = await getSettingsValueByKey('TheNumberList')

        expect(nameDb).equal('Cristian')
        expect(ageDb).equal(38)
        expect(theBooleanDB).equal(false)
        expect(numberListDB[0]).equal(4)
        expect(numberListDB[1]).equal(5)
        expect(numberListDB[2]).equal(6)


        await sleep(5)

        let nameCache2 = await SettingCache('name',3)
        let ageCache2 = await SettingCache('age',3)
        let extraordinaryCache2 = await SettingCache('TheBoolean',3)
        let numberListCache2 = await SettingCache('TheNumberList',3)

        expect(nameCache2).equal('Cristian')
        expect(ageCache2).equal(38)
        expect(extraordinaryCache2).equal(false)
        expect(numberListCache2[0]).equal(4)
        expect(numberListCache2[1]).equal(5)
        expect(numberListCache2[2]).equal(6)

    });

})
