const mongoose = require('mongoose');
const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.simple()
    ),
    transports: [new winston.transports.Console()]
});

async function fixUsedSpace() {
    const mongoUri = process.env.MONGO_URI || process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/skeleton';
    
    logger.info('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    logger.info('Connected to MongoDB');

    const db = mongoose.connection.db;

    const userStorages = await db.collection('userstorages').find({}).toArray();
    
    logger.info(`Found ${userStorages.length} user storages`);

    for (const userStorage of userStorages) {
        const userId = userStorage.user;
        
        const files = await db.collection('files').find({
            'createdBy.user': new mongoose.Types.ObjectId(userId)
        }).toArray();

        const realUsedSpace = files.reduce((sum, file) => sum + (file.size || 0), 0);
        const currentUsedSpace = userStorage.usedSpace || 0;
        const diff = realUsedSpace - currentUsedSpace;

        logger.info(`User ${userId}:`);
        logger.info(`  Current usedSpace: ${currentUsedSpace.toFixed(2)} MB`);
        logger.info(`  Real usedSpace: ${realUsedSpace.toFixed(2)} MB`);
        logger.info(`  Difference: ${diff.toFixed(2)} MB`);
        logger.info(`  File count: ${files.length}`);

        if (Math.abs(diff) > 0.01) {
            logger.info(`  Fixing...`);
            await db.collection('userstorages').updateOne(
                { _id: userStorage._id },
                { $set: { usedSpace: realUsedSpace } }
            );
            logger.info(`  Fixed!`);
        } else {
            logger.info(`  No fix needed`);
        }
        logger.info('');
    }

    logger.info('Done!');
    await mongoose.disconnect();
}

fixUsedSpace().catch(err => {
    logger.error('Error:', err);
    process.exit(1);
});
