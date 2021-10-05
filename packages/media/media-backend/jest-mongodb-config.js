module.exports = {
    mongodbMemoryServerOptions: {
        instance: {
            dbName: 'jest',
            options: { useUnifiedTopology: true }
        },
        binary: {
            version: '4.2.0', // Version of MongoDB
            skipMD5: true
        },
        autoStart: false
    }
};
