import {mongoose} from '@dracul/common-backend';



const mongoosePaginate = require('mongoose-paginate-v2');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const SettingsSchema = new Schema({

 key: {type: String, required: true, unique: true},
 value: {type: String, required: false, unique: false},
 label: {
            en: {type: String, required: false},
            es: {type: String, required: false},
            pt: {type: String, required: false},
        }


});




SettingsSchema.plugin(mongoosePaginate);
SettingsSchema.plugin(uniqueValidator, {message: 'validation.unique'});

const Settings = mongoose.model('Settings', SettingsSchema);

module.exports = Settings;
