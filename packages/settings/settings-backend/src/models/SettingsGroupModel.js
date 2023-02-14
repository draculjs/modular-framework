import {mongoose} from '@dracul/common-backend'
import { SettingsSchema } from './SettingsModel'

const Schema = mongoose.Schema

const SettingsGroupSchema = new Schema({
    name: {
        type: String, required: true, unique: false, default: 'General'
    },
    settings: [String]
})

const SettingsGroup = mongoose.model('SettingsGroup', SettingsGroupSchema)

module.exports = SettingsGroup
