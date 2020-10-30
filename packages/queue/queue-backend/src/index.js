
'use strict'

var MongooseQueue = require('./mongoose-queue');
var QueueSchema = require('./schemas/queue-schema');
var producerManager = require('./producer-manager');
var workerManager = require('./worker-manager');

module.exports = {
    MongooseQueue: MongooseQueue,
    QueueSchema: QueueSchema,
    producerManager: producerManager,
    workerManager: workerManager

};
