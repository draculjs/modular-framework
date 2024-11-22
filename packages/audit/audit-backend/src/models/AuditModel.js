const { mongoose } = require('@dracul/common-backend')
const mongoosePaginate = require('mongoose-paginate-v2')
const uniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema

const ChangeSchema = new Schema({
    field: { type: String, required: true },
    oldValue: { type: Schema.Types.Mixed, required: true },
    newValue: { type: Schema.Types.Mixed, required: true }
}, { _id: false }) // _id: false para evitar que se genere un _id en subdocumentos

const AuditSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: false, index: false },
    action: { type: String, required: true, index: false },
    entity: { type: String, required: true, unique: false, index: false },
    details: { type: String, required: false, unique: false, index: false },
    changes: { type: [ChangeSchema], required: false, unique: false, index: false } 
}, { timestamps: true })

AuditSchema.plugin(mongoosePaginate)
AuditSchema.plugin(uniqueValidator, { message: 'validation.unique' })

export const Audit = mongoose.model('Audit', AuditSchema)
