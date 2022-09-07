import mongoInMemoryConnect from "../mongoInMemory";
import {initializeSetting, initializeSettings} from "../../src/services/SettingsService";
import {SETTING1, SETTINGS} from "../data/settings.data";
import {fetchSettings, findSettingsByKey} from "../../src/services/SettingsService";
import {expect} from 'chai'


describe("SettingsService", () => {


    before(async () => {
        await mongoInMemoryConnect()
        return true
    });

    it('initialize one Setting happy path', async () => {
        let settingDoc = await initializeSetting(SETTING1)

        expect(settingDoc.key).equal('name')
        let settingFromDB = await findSettingsByKey('name')

        expect(settingFromDB.key).equal('name')

    });

    it('initialize without param object throw error', async () => {

        try{
            let settingDoc = await initializeSetting('asdasd')
        }catch (e) {
            expect(e).instanceOf(Error)
            expect(e.message).equal('Setting must be an Object')
        }

    });

    it('initializeSettings happy path', async () => {
        let settingsDoc = await initializeSettings(SETTINGS)
        console.log("settingsDoc", settingsDoc)

        expect(settingsDoc[0].key).equal('name')
        expect(settingsDoc[1].key).equal('age')
        expect(settingsDoc[2].key).equal('extraordinary')

        let settingsFromDB = await fetchSettings()

        expect(settingsFromDB[0].key).equal('name')
        expect(settingsFromDB[1].key).equal('age')
        expect(settingsFromDB[2].key).equal('extraordinary')

    });


    it('initializeSettings without an array throw error', async () => {
        try{
            await initializeSettings({})
        }catch (e) {
            expect(e).instanceOf(Error)
            expect(e.message).equal('Settings must be an Array')
        }
    });


    it('initializeSettings without a key throw error', async () => {
        try{
            await initializeSettings([{asd:'asd'}])
        }catch (e) {
            expect(e).instanceOf(Error)
            expect(e.message).equal('Setting must have a key')
        }
    });


})
