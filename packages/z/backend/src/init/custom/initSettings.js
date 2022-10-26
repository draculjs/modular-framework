import {createSettings, findSettingsByKey, updateSettings} from "@dracul/settings-backend";


const settings = [
    // {
    //     key: 'ip',
    //     type: 'string',
    //     value: '',
    //     label: {en: 'ip', es: 'ip', pt: 'ip'},
    //     regex: ''
    // }
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
