import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const BaseErrorSchema = new Schema({

    name: {
        type: String,
        required: true,
        index: false,
        validate: {
            validator: function (value) {
                let r = /^[A-Za-z\s]+$/;
                return r.test(value);
            },
            message: "validation.onlyLetters"
        }
    },
    lastname: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
        index: false,
        validate: {
            validator: function (value) {
                return (value > 0 && value < 50);
            },
            message: "validation.outOfRange"
        }
    },
    color: {
        type: String,
        required: true,
        index: false,
        validate: {
            validator: function (value) {
                let r = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
                return r.test(value);
            },
            message: "validation.invalidHexColor"
        }
    }
});


const BaseError = mongoose.model('BaseError', BaseErrorSchema);

module.exports = BaseError;
