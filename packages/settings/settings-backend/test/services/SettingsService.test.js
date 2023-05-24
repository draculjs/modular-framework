import {
    findSettingsByKey,
    findSettingsByKeys,
    createOrUpdateSettings,
    getSettingsValueByKey,
    updateSettingsByKey
} from "../../src";
import {expect} from 'chai'
import MongoInMemory from "../mongo-in-memory";
import {initializeSettings} from "../init/settings.init";
import {
    SETTING_BOOLEAN, SETTING_NUMBER,
    SETTING_STRING,
    SETTING_STRING_ALIAS,
    SETTING_STRING_ALIAS_MODIFIED
} from "../data/settings.data";

describe("SettingsService", () => {


    before(async () => {
        await MongoInMemory.connect()
        await initializeSettings()
        return
    });

    after(async () => {
        await MongoInMemory.DropAndClose()
        return
    });

    it('getSettingsValueByKey stringSetting', async () => {
        let stringSetting = await getSettingsValueByKey(SETTING_STRING.key)

        console.log("name",stringSetting)
        expect(stringSetting).equal(SETTING_STRING.value)
    });

    it('getSettingsValueByKey numberSetting', async () => {
        let numberSetting = await getSettingsValueByKey(SETTING_NUMBER.key)

        console.log("age",numberSetting)
        expect(numberSetting).equal(SETTING_NUMBER.value)
    });

    it('getSettingsValueByKey booleanSetting', async () => {
        let booleanSetting = await getSettingsValueByKey(SETTING_BOOLEAN.key)

        console.log("booleanSetting",booleanSetting)
        expect(booleanSetting).equal(true)
    });

    it('findSettingsByKey', async () => {
        let setting = await findSettingsByKey(SETTING_STRING.key)

        console.log("Setting",setting)
        expect(setting.key).equal(SETTING_STRING.key)
        expect(setting.value).equal(SETTING_STRING.value)
        return
    });


    it('findSettingsByKeys', async () => {
        let {name, age} = await findSettingsByKeys([SETTING_STRING.key,SETTING_NUMBER.key])

        expect(name.key).equal(SETTING_STRING.key)
        expect(name.value).equal(SETTING_STRING.value)

        expect(age.key).equal(SETTING_NUMBER.key)
        expect(age.value).equal(SETTING_NUMBER.value)
        return
    });



    it('createOrUpdateSettings', async () => {
        let setting = await createOrUpdateSettings(null,SETTING_STRING_ALIAS)

        expect(setting.key).equal(SETTING_STRING_ALIAS.key)
        expect(setting.type).equal(SETTING_STRING_ALIAS.type)
        expect(setting.value).equal(SETTING_STRING_ALIAS.value)
        expect(setting.label.es).equal(SETTING_STRING_ALIAS.label.es)

        setting = await createOrUpdateSettings(null,SETTING_STRING_ALIAS_MODIFIED)

        expect(setting.key).equal(SETTING_STRING_ALIAS.key)
        expect(setting.type).equal(SETTING_STRING_ALIAS.type)
        expect(setting.value).equal(SETTING_STRING_ALIAS.value)
        expect(setting.label.es).equal(SETTING_STRING_ALIAS_MODIFIED.label.es)

        return
    });

    it('updateSettingsByKey', async () => {

        //STRING
        let settingString = await getSettingsValueByKey(SETTING_STRING.key)
        expect(settingString).equal(SETTING_STRING.value)

        const NEW_STRING_VALUE = "Dany"
        settingString = await updateSettingsByKey(null,{key: SETTING_STRING.key, value: NEW_STRING_VALUE})

        expect(settingString.key).equal(SETTING_STRING.key)
        expect(settingString.type).equal(SETTING_STRING.type)
        expect(settingString.value).equal(NEW_STRING_VALUE)

        //BOOLEAN
        let settingBoolean = await getSettingsValueByKey(SETTING_BOOLEAN.key)
        expect(settingBoolean).equal(true)

        const NEW_BOOLEAN_VALUE = false
        settingBoolean = await updateSettingsByKey(null,{key: SETTING_BOOLEAN.key, value: NEW_BOOLEAN_VALUE})

        expect(settingBoolean.key).equal(SETTING_BOOLEAN.key)
        expect(settingBoolean.type).equal(SETTING_BOOLEAN.type)
        expect(settingBoolean.value).equal("disable")

        //BOOLEAN 2 ("enable")
        const NEW_BOOLEAN_VALUE_STRING = "enable"
        settingBoolean = await updateSettingsByKey(null,{key: SETTING_BOOLEAN.key, value: NEW_BOOLEAN_VALUE_STRING})

        expect(settingBoolean.key).equal(SETTING_BOOLEAN.key)
        expect(settingBoolean.type).equal(SETTING_BOOLEAN.type)
        expect(settingBoolean.value).equal(NEW_BOOLEAN_VALUE_STRING)

    });
})
