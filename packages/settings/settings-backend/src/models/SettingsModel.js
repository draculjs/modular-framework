import {mongoose} from '@dracul/common-backend';
import mongoosePaginate from 'mongoose-paginate-v2';

const Schema = mongoose.Schema
const SettingsSchema = new Schema({
    key: {
        type: String, 
        required: true, 
        unique: true // Índice único para la base de datos
    },
    value: {type: String, required: false},
    valueList: [{type: String, required: false}],
    label: {
        en: {type: String, required: false},
        es: {type: String, required: false},
        pt: {type: String, required: false},
    },
    group: {type: String, required: true},
    type: {
        type: String,
        default: "string",
        enum: ['string','number','enum','boolean', 'password', 'dynamic','stringList','numberList', 'enumList'],
        required: false
    },
    options: [{type: String}],
    regex: {type: String},
    entity: {type: String, required: false},
    entityValue: {type: String, required: false},
    entityText: {type: String, required: false},
    prefix: {type: String, required: false},
    suffix: {type: String, required: false},
})

SettingsSchema.plugin(mongoosePaginate);

export const Settings = mongoose.model('Settings', SettingsSchema)
export default Settings