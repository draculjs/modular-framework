import mongoose from 'mongoose'

const ObjectId = mongoose.Types.ObjectId

export const SETTING1 = {
    _id: ObjectId(),
    key: 'name',
    type: 'string',
    value: 'John',
    group: 'Default',
    label: {en: 'Name', es: 'Nombre', pt: 'Nome'}
}

export const SETTING2 = {
    _id: ObjectId(),
    key: 'age',
    type: 'number',
    value: 37,
    group: 'Default',
    label: {en: 'Age', es: 'Año', pt: 'Anio'}
}

export const SETTING3 = {
    _id: ObjectId(),
    key: 'extraordinary',
    type: 'boolean',
    value: 'enable',
    group: 'Default',
    label: {en: 'Extraordinary', es: 'Extraordinario', pt: 'Extraordinario'}
}

export const SETTING4 = {
    _id: ObjectId(),
    key: 'numberList',
    type: 'numberList',
    valueList: [1,2,3],
    group: 'Default',
    label: {en: 'Extraordinary', es: 'Extraordinario', pt: 'Extraordinario'}
}

export const SETTINGS = [
    SETTING1,
    SETTING2,
    SETTING3,
    SETTING4
]
