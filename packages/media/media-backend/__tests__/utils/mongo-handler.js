const mongoose = require('mongoose');

let isConnected = false;

module.exports.connect = async () => {
    if (isConnected && mongoose.connection.readyState === 1) {
        return;
    }

    const mongoUri = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/jest_media';
    const mongooseOpts = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    };

    try {
        await mongoose.connect(mongoUri, mongooseOpts);
        isConnected = true;
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error.message);
        throw error;
    }
};

module.exports.closeDatabase = async () => {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        isConnected = false;
    }
};

module.exports.clearDatabase = async () => {
    if (mongoose.connection.readyState === 0) {
        await this.connect();
    }
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
};
