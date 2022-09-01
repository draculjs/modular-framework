import {mongoose} from '@dracul/common-backend';
var { MongoMemoryServer } = require('mongodb-memory-server');
const {Promise} = require("mongoose");


const mongoServer = new MongoMemoryServer();

export const mongoInMemoryConnect = () => {

    return new Promise((resolve, reject) => {
        //mongoose.Promise = Promise;
        console.log(`MongoDB in memory connecting...`);

        mongoServer.getUri().then((mongoUri) => {
            const mongooseOpts = {
                useNewUrlParser: true,
                useUnifiedTopology: true
            };

            mongoose.connect(mongoUri, mongooseOpts);

            mongoose.connection.on('error', (e) => {
                return reject(e)
            });

            mongoose.connection.once('open', () => {
                console.log(`MongoDB successfully connected to ${mongoUri}`);
                return resolve()
            });
        });


    })
}

export default mongoInMemoryConnect


