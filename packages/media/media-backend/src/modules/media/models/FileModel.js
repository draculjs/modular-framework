const mongoose = require('mongoose');
const softDelete = require('mongoose-softdelete')
const mongoosePaginate = require('mongoose-paginate-v2');

const Schema = mongoose.Schema;

const FileSchema = new Schema({

    filename: {type: String, required: true},
    description: {type: String, required: false},
    tags: [{type: String, required: false}],
    mimetype: {type: String, required: true},
    encoding: {type: String, required: true},
    extension: {type: String, required: true},
    type: {type: String, required: true},
    relativePath: {type: String, required: true},
    absolutePath: {type: String, required: true},
    size: {type: Number, required: true},
    url: {type: String, required: true},
    createdAt: {type: Date, required: true, default: Date.now},
    createdBy: {
        user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: false},
        username: {type: String, required: true}
    }


});

FileSchema.plugin(softDelete);
FileSchema.plugin(mongoosePaginate);

const File = mongoose.model('File', FileSchema);

module.exports = File;