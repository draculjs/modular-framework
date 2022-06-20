import {mongoose} from '@dracul/common-backend';
import softDelete from 'mongoose-softdelete'
import mongoosePaginate from 'mongoose-paginate-v2';
import uniqueValidator from 'mongoose-unique-validator';
import {findGroupByName} from "../services/GroupService";

const Schema = mongoose.Schema;

const GroupSchema = new Schema({

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


const GroupModel = mongoose.model('Group', GroupSchema);

export {
    GroupSchema,
    GroupModel
}
export default GroupModel

//module.exports = Group;
