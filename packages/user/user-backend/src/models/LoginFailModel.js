import {mongoose} from '@dracul/common-backend';

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
const LoginFailSchema = new mongoose.Schema({
    username: {type: String, unique: false, required: false, dropDups: true},
    date: {type: Date, required: true, default: Date.now},
    agent: {type: String, unique: false, required: true, dropDups: true},
    ip: {type: String, unique: false, required: true, dropDups: true},
    geo: geoSchema,
    device: deviceSchema,
    client: clientSchema,
    os: osSchema
});

LoginFailSchema.set('toJSON', {getters: true});


module.exports = mongoose.model('LoginFail', LoginFailSchema)
