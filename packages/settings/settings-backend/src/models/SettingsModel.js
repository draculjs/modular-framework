import {mongoose} from '@dracul/common-backend';

const mongoosePaginate = require('mongoose-paginate-v2');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema
const SettingsSchema = new Schema({

    key: {type: String, required: true, unique: true},
    value: {type: String, required: false, unique: false},
    valueList: [{type: String, required: false, unique: false}],
    label: {
        en: {type: String, required: false},
        es: {type: String, required: false},
        pt: {type: String, required: false},
    },
    group: {type: String, required: true},
    type: {type: String, default: "string", enum: ['string','number','enum','boolean', 'password', 'dynamic','stringList','numberList', 'enumList', 'file'], required: false, unique: false},
    options: [{type: String}],
    regex: {type: String},
    entity: {type: String, required: false},
    entityValue: {type: String, required: false},
    entityText: {type: String, required: false, unique: false},
    prefix: {type: String, required: false},
    suffix: {type: String, required: false},
})

SettingsSchema.plugin(mongoosePaginate);
SettingsSchema.plugin(uniqueValidator, {message: 'validation.unique'})

const Settings = mongoose.model('Settings', SettingsSchema)

module.exports = Settings
