import {mongoose} from '@dracul/common-backend';
import softDelete from 'mongoose-softdelete'
import mongoosePaginate from 'mongoose-paginate-v2';
import uniqueValidator from 'mongoose-unique-validator';

const Schema = mongoose.Schema;
export const GroupSchema = new Schema({

    name: {
        type: String,
        required: true,
        unique: false,
        index: false,
    },
    color: {
        type: String,
        required: false,
        validate: {
            validator: function (value) {
                let r = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
                return r.test(value);
            },
            message: "validation.invalidHexColor"
        }
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }]

});
GroupSchema.plugin(uniqueValidator, {message: 'validation.unique'});
GroupSchema.plugin(softDelete);
GroupSchema.plugin(mongoosePaginate);

GroupSchema.set('toJSON', {
    transform: (doc, result) => {
        return {
            ...result,
            id: result._id
        };
    }
});


export const GroupModel = mongoose.model('Group', GroupSchema);
export default GroupModel
