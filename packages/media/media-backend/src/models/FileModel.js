import { mongoose } from '@dracul/common-backend'
const softDelete = require('mongoose-softdelete')
const mongoosePaginate = require('mongoose-paginate-v2')

const Schema = mongoose.Schema

const FileSchema = new Schema({

    filename: { type: String, required: true },
    description: { type: String, required: false },
    tags: [{ type: String, required: false }],
    mimetype: { type: String, required: true },
    encoding: { type: String, required: true },
    extension: { type: String, required: true },
    type: { type: String, required: true },
    relativePath: { type: String, required: true, index: true },
    absolutePath: { type: String, required: true },
    size: { type: Number, required: true },
    url: { type: String, required: true },
    lastAccess: { type: Date, required: true, default: Date.now },
    createdAt: { type: Date, required: true, default: Date.now },
    createdBy: {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
        username: { type: String, required: true }
    },
    expirationDate: { type: Date, required: false },
    isPublic: { type: Boolean, required: false },
    hits: { type: Number, require: false, default: 0 },
    groups: [{ type: mongoose.Schema.Types.ObjectId, ref: "Group", required: false }],
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }],

});

FileSchema.plugin(mongoosePaginate)

const File = mongoose.model('File', FileSchema)

module.exports = File
