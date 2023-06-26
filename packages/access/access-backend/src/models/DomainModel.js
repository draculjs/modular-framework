import { mongoose } from '@dracul/common-backend'
import mongoosePaginate from 'mongoose-paginate-v2'

const Schema = mongoose.Schema

const DomainSchema = new Schema({
    value: {
        type: String, 
        required: true, 
        index: true, 
        unique: true,
        validate: {
            validator: function(value){
                if(/^(?:(?:https?|ftp):\/\/)?(?:www\.)?([a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9_-]+)*\.[a-zA-Z]{2,})(?:\/[^\s]*)?$/.test(value)) return true
                if(/^https?:\/\/([a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9_-]+)?)(?::\d+)?$/.test(value)) return true
                return false
            }
        }
    },
    enable: {
        type: Boolean,
        required: true,
        index: false,
        unique: false
    }
}, { timestamps: true })

DomainSchema.plugin(mongoosePaginate)

const Domain = mongoose.model('Domain', DomainSchema)

export default Domain