import {mongoose} from '@dracul/common-backend';

const UserActivationSchema = new mongoose.Schema({
    code: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
});

UserActivationSchema.set('toJSON', { getters: true });

export const UserActivation = mongoose.model('UserActivation', UserActivationSchema);
