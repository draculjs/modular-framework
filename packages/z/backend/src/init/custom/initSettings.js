import {createSettings, findSettingsByKey, updateSettings} from "@dracul/settings-backend";


const settings = [
    {
        key: 'dynamic',
        type: 'dynamic',
        value: '',
        label: {en: 'Dynamic setting value', es: 'Dynamic setting value', pt: 'Dynamic setting value'},
        entity: 'roles',
        entityValue: '_id',
        entityText: 'name',
    },
    {
        key: 'dynamic2',
        type: 'dynamic',
        value: '',
        label: {en: 'Dynamic setting value', es: 'Dynamic setting value', pt: 'Dynamic setting value'},
        entity: 'roles',
        entityValue: 'name',
        entityText: '_id',
    },
    {
        key: 'dynamic3',
        type: 'dynamic',
        value: '',
        label: {en: 'Dynamic setting', es: 'Dynamic setting', pt: 'Dynamic setting'},
        entity: 'roles',
        entityValue: 'name',
        entityText: 'name',
    }
]

export const initSettings = async function () {

    for (let i in settings) {
        const setting = await findSettingsByKey(settings[i].key)
        if (!setting) {
            await createSettings(null, settings[i])
        }else{
            await updateSettings(null, setting.id, settings[i])
        }
    }

}
