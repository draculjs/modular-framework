import mongoose from 'mongoose'

const ObjectId = mongoose.Types.ObjectId

export const SETTING_STRING = {
    _id: ObjectId(),
    key: 'name',
    type: 'string',
    value: 'John',
    group: 'Default',
    label: {en: 'Name', es: 'Nombre', pt: 'Nome'}
}

export const SETTING_NUMBER = {
    _id: ObjectId(),
    key: 'age',
    type: 'number',
    value: 37,
    group: 'Default',
    label: {en: 'Age', es: 'Año', pt: 'Anio'}
}

export const SETTING_BOOLEAN = {
    _id: ObjectId(),
    key: 'TheBoolean',
    type: 'boolean',
    value: 'enable',
    group: 'Default',
    label: {en: 'theboolean', es: 'theboolean', pt: 'theboolean'}
}

export const SETTING_NUMBERLIST = {
    _id: ObjectId(),
    key: 'TheNumberList',
    type: 'numberList',
    valueList: [1,2,3],
    group: 'Default',
    label: {en: 'numberList', es: 'numberList', pt: 'numberList'}
}

export const SETTING_STRINGLIST = {
    _id: ObjectId(),
    key: 'TheStringList',
    type: 'stringList',
    valueList: ["one", "two", "three"],
    group: 'Default',
    label: {en: 'stringList', es: 'stringList', pt: 'stringList'}
}

export const SETTING_STRING_ALIAS = {
    _id: ObjectId(),
    key: 'alias',
    type: 'string',
    value: 'Vlad',
    group: 'Default',
    label: {en: 'Alias', es: 'Alias', pt: 'Alias'}
}

export const SETTING_STRING_ALIAS_MODIFIED = {
    _id: ObjectId(),
    key: 'alias',
    type: 'string',
    value: 'Vlady',
    group: 'Default',
    label: {en: 'The Alias', es: 'El Alias', pt: 'El Alias'}
}

export const SETTINGS = [
    SETTING_STRING,
    SETTING_NUMBER,
    SETTING_BOOLEAN,
    SETTING_NUMBERLIST
]
