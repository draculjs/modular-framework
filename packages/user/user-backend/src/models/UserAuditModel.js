import {mongoose} from '@dracul/common-backend';


// Defining user Mongoose Schema
const UserAuditSchema = new mongoose.Schema({
    actionBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: false,
        required: false,
        dropDups: true
    },
    actionFor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: false,
        required: true,
        dropDups: true
    },
    action: {type: String, unique: false, required: true, dropDups: true},
    date: {type: Date, required: true, default: Date.now},
});

UserAuditSchema.set('toJSON', {getters: true});


module.exports = mongoose.model('UserAudit', UserAuditSchema)
