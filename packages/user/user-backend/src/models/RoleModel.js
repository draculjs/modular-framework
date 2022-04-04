import {mongoose} from '@dracul/common-backend';
import softDelete from 'mongoose-softdelete'
import mongoosePaginate from 'mongoose-paginate-v2';
import uniqueValidator from 'mongoose-unique-validator';

const Schema = mongoose.Schema

const RoleSchema = new Schema({
    name: {type: String, unique: true, required: true, index: true},
    permissions: [{type: String, required: true}],
    childRoles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        required: false,
    }],
    readonly: {type: Boolean, required: false, default: false},
});

RoleSchema.plugin(uniqueValidator, {message: 'validation.unique'});
RoleSchema.plugin(softDelete);
RoleSchema.plugin(mongoosePaginate);

RoleSchema.set('toJSON', {getters: true});

const RoleModel = mongoose.model('Role', RoleSchema);

export {
    RoleSchema,
    RoleModel
}

export default RoleModel

//module.exports = RoleModel
