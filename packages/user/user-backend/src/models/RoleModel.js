import {mongoose} from '@dracul/common-backend';
import softDelete from 'mongoose-softdelete'
import mongoosePaginate from 'mongoose-paginate-v2';

const Schema = mongoose.Schema

export const RoleSchema = new Schema({
    name: {
        type: String, 
        required: true, 
        index: true,
        unique: true // Índice único para la base de datos
    },
    permissions: [{type: String, required: true}],
    childRoles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        required: false,
    }],
    readonly: {type: Boolean, required: false, default: false},
});

// Eliminado: uniqueValidator
RoleSchema.plugin(softDelete);
RoleSchema.plugin(mongoosePaginate);

RoleSchema.set('toJSON', {getters: true});

export const RoleModel = mongoose.model('Role', RoleSchema);
export default RoleModel;