import {mongoose} from '@dracul/common-backend';
import softDelete from 'mongoose-softdelete'
import mongoosePaginate from 'mongoose-paginate-v2';

import uniqueValidator from 'mongoose-unique-validator';

// Defining user Mongoose Schema
const UserSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true, index: true},
    email: {
        type: String,
        unique: true,
        required: true,
        index: true,
        validate: {
            validator: function (value) {
                let r = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
                return r.test(value);
            },
            message: "validation.emailFormat"
        }
    },
    password: {type: String, required: true},
    code: {type: String, required: false},
    name: {type: String, required: true},
    active: {type: Boolean, required: true, default: false},
    phone: {
        type: String,
        required: false,
        validate: {
            validator: function (value) {
                let r = /[0-9]+/;
                return value ? r.test(value) : true;
            },
            message: "Telefono no tiene un formato valido"
        }
    },
    avatar: String,
    avatarurl: String,
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        required: true,
    },
    groups: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: false,
    }],
    refreshToken: {
        type: [
            {
                id: {type: String},
                expiryDate: {type: Date},
                sessionId: {type: String},
            }
        ],
        default: [],
        _id: false
    },
    fromLDAP: {type: Boolean, required: true, default: false},
}, {timestamps: true});

UserSchema.set('toJSON', {getters: true});

UserSchema.plugin(uniqueValidator, {message: 'validation.unique'});

UserSchema.plugin(softDelete);
UserSchema.plugin(mongoosePaginate);

const UserModel = mongoose.model('User', UserSchema);

export {
    UserSchema,
    UserModel
}

export default UserModel

