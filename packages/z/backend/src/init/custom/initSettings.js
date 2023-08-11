import {createOrUpdateSettings} from "@dracul/settings-backend";


const settings = [

    {
        key: 'StringKey',
        type: 'string',
        value: "StringValue",
        group: 'Basic',
        label: {en: 'String Key', es: 'String Key', pt: 'String Key'},
        prefix: 'PREFIX',
        suffix: 'SUFFIX'
    },

    {
        key: 'NumberKey',
        type: 'number',
        value: "123",
        group: 'Basic',
        label: {en: 'Number Key', es: 'Number Key', pt: 'Number Key'},
        prefix: '$',
        suffix: 'KM'
    },



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
    },



    {
        key: 'numberListKey',
        type: 'numberList',
        valueList: [],
        group: 'List',
        label: {en: 'Number List', es: 'Number List', pt: 'Number List'},
    },

    {
        key: 'stringListKey',
        type: 'stringList',
        valueList: [],
        group: 'List',
        label: {en: 'String List', es: 'String List', pt: 'String List'},
    }
]

export const initSettings = async function () {

    for (let i in settings) {
        await createOrUpdateSettings(null, settings[i])
    }

}
