'use strict';

const MongooseQueue = require('./mongoose-queue');

const QueueModel = require('./models/QueueModel');

const QueueStatsModel = require('./models/QueueStatsModel');

const producerManager = require('./producer-manager');

const workerManager = require('./worker-manager');

const {
  fetchQueues
} = require('./services/QueueService');

const {
  fetchQueueStats
} = require('./services/QueueStatsService');

module.exports = {
  MongooseQueue,
  QueueModel,
  QueueStatsModel,
  producerManager,
  workerManager,
  fetchQueues,
  fetchQueueStats
};