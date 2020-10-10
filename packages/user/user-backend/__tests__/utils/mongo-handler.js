const mongoose = require('mongoose');

/**
 * Connect to the in-memory database.
 */
module.exports.connect = async () => {

    const mongooseOpts = {
        useNewUrlParser: true,
        //  autoReconnect: true,
        //  reconnectTries: Number.MAX_VALUE,
        //  reconnectInterval: 1000,
        useUnifiedTopology: true
    };

    await mongoose.connect(process.env.MONGO_URL, mongooseOpts);
}

/**
 * Drop database, close the connection and stop mongod.
 */
module.exports.closeDatabase = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
}

/**
 * Remove all the data for all db collections.
 */
module.exports.clearDatabase = async () => {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany();
    }
}