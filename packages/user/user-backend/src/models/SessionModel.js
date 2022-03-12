import {mongoose} from '@dracul/common-backend';

import uniqueValidator from 'mongoose-unique-validator';


const osSchema = new mongoose.Schema({
    family: {type: String, required: false},
    name: {type: String, required: false},
    version: {type: String, required: false},
    platform: {type: String, required: false}
})

const clientSchema = new mongoose.Schema({
    type: {type: String, required: false},
    name: {type: String, required: false},
    version: {type: String, required: false},
})

const deviceSchema = new mongoose.Schema({
    type: {type: String, required: false},
    brand: {type: String, required: false},
    model: {type: String, required: false},
})


const geoSchema = new mongoose.Schema({
    country: {type: String, required: false},
    region: {type: String, required: false},
    timezone: {type: String, required: false},
    city: {type: String, required: false},
})


// Defining user Mongoose Schema
const SessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: false,
        required: true
    },
    username: {type: String, unique: false, required: false, dropDups: true},
    since: {type: Date, required: true, default: Date.now},
    until: {type: Date, required: true, default: Date.now},
    duration: {type: Number, required: false, default: 0},
    request: {type: Number, required: false, default: 1},
    agent: {type: String, unique: false, required: true, dropDups: true},
    ip: {type: String, unique: false, required: true, dropDups: true},
    geo: geoSchema,
    device: deviceSchema,
    client: clientSchema,
    os: osSchema
});

SessionSchema.set('toJSON', {getters: true});

SessionSchema.plugin(uniqueValidator, {message: '{VALUE} ya existe. {PATH} debe ser unico.'});

export default mongoose.model('Session', SessionSchema);
