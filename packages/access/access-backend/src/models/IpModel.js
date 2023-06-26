import { mongoose } from '@dracul/common-backend'
import mongoosePaginate from 'mongoose-paginate-v2'

const Schema = mongoose.Schema

const IpSchema = new Schema({
    value: {
        type: String, 
        required: true, 
        index: true, 
        unique: true,
        validate: {
            validator: function(value){
                const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
                return ipRegex.test(value)
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

IpSchema.plugin(mongoosePaginate)

const Ip = mongoose.model('Ip', IpSchema)

export default Ip