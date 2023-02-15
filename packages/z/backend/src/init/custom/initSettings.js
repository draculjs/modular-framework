import {createOrUpdateSettings} from "@dracul/settings-backend";


const settings = [
    {
        key: 'dynamic',
        type: 'dynamic',
        value: '',
        group: 'dynamic',
        label: {en: 'Dynamic setting value', es: 'Dynamic setting value', pt: 'Dynamic setting value'},
        entity: 'roles',
        entityValue: '_id',
        entityText: 'name',
    },
    {
        key: 'dynamic2',
        type: 'dynamic',
        value: '',
        group: 'General',
        label: {en: 'Dynamic setting value', es: 'Dynamic setting value', pt: 'Dynamic setting value'},
        entity: 'roles',
        entityValue: 'name',
        entityText: '_id',
    },
    {
        key: 'dynamic3',
        type: 'dynamic',
        value: '',
        group: 'dynamic3',
        label: {en: 'Dynamic setting', es: 'Dynamic setting', pt: 'Dynamic setting'},
        entity: 'roles',
        entityValue: 'name',
        entityText: 'name',
    }
]

export const initSettings = async function () {

    for (let i in settings) {
        await createOrUpdateSettings(null, settings[i])
    }

}
