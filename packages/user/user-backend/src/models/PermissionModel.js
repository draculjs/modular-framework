import {mongoose} from '@dracul/common-backend';
const Schema = mongoose.Schema

const PermissionSchema = new Schema({
    name: { type: String, unique : true, required : true, index: true },
});

PermissionSchema.set('toJSON', { getters: true });

export const PermissionModel = mongoose.model('Permission', PermissionSchema);
export default PermissionModel
