"use strict";

const {
  DefaultLogger
} = require('@dracul/logger-backend');

const QueueModel = require('../models/QueueModel');

const isPlainObject = require('../utils/isPlainObject');

const {
  incrementDoneStat,
  incrementAddedStat,
  incrementFailedStat,
  incrementGottenStat
} = require('./QueueStatsService');

const fetchQueues = function () {
  return new Promise((resolve, reject) => {
    QueueModel.find({}).exec((err, res) => {
      if (err) {
        DefaultLogger.error("QueueService.fetchQueues ", err);
        reject(err);
      }

      DefaultLogger.debug("QueueService.fetchQueues successful");
      resolve(res);
    });
  });
};

const addJob = function (topic, payload, delay, maxRetries) {
  if (!topic) return Promise.reject(new Error('Topic missing.'));else if (!topic instanceof String) return Promise.reject(new Error('Topic is not a String.'));
  if (!payload) return Promise.reject(new Error('Payload missing.'));else if (!isPlainObject(payload)) return Promise.reject(new Error('Payload is not a plain object.'));
  if (delay === null || delay === undefined) return Promise.reject(new Error('delay missing.'));else if (!delay instanceof Number) return Promise.reject(new Error('delay is not a number.'));
  return new Promise((resolve, reject) => {
    new QueueModel({
      topic: topic,
      payload: payload,
      blockedUntil: new Date(Date.now() + delay),
      maxRetries: maxRetries
    }).save(function (err, job) {
      if (err) {
        reject(err);
        return;
      }

      incrementAddedStat(topic);
      resolve(job);
    });
  });
};

const getJob = function (topic, workerId, maxRetries, blockDuration) {
  if (!topic) return Promise.reject(new Error('Topic missing.'));else if (!topic instanceof String) return Promise.reject(new Error('Topic is not a String.'));
  if (!workerId) return Promise.reject(new Error('workerId missing.'));else if (!workerId instanceof String) return Promise.reject(new Error('workerId is not a String.'));
  return new Promise((resolve, reject) => {
    QueueModel.findOneAndUpdate({
      topic: topic,
      blockedUntil: {
        $lt: Date.now()
      },
      $expr: {
        $lt: ["$retries", "$maxRetries"]
      },
      done: false
    }, {
      $set: {
        blockedUntil: new Date(Date.now() + blockDuration),
        workerId: workerId,
        ...(maxRetries && {
          maxRetries
        })
      },
      $inc: {
        retries: 1
      }
    }, {
      new: true,
      sort: {
        createdAt: 1
      }
    }).exec(function (err, job) {
      if (err) {
        reject(err);
        return;
      } else if (!job) {
        resolve(null);
      } else {
        incrementGottenStat(topic);
        resolve(job);
      }
    });
  });
};

const ackJob = function (jobId) {
  if (!jobId) return Promise.reject(new Error('jobId missing.'));else if (!jobId instanceof String) return Promise.reject(new Error('jobId is not a String.'));
  return new Promise((resolve, reject) => {
    QueueModel.findOneAndUpdate({
      _id: jobId
    }, {
      $set: {
        done: true
      }
    }, {
      new: true
    }, function (err, job) {
      if (err) {
        reject(err);
        return;
      } else if (!job) {
        reject(new Error('Job id invalid, job not found.'));
        return;
      } else incrementDoneStat(job.topic);

      resolve(job);
    });
  });
};

const errorJob = function (jobId, errorMessage, done = false) {
  if (!jobId) return Promise.reject(new Error('jobId missing.'));else if (!jobId instanceof String) return Promise.reject(new Error('jobId is not a String.'));
  if (!errorMessage) return Promise.reject(new Error('errorMessage missing.'));else if (!errorMessage instanceof String) return Promise.reject(new Error('errorMessage is not a String.'));
  return new Promise((resolve, reject) => {
    QueueModel.findOneAndUpdate({
      _id: jobId
    }, {
      $set: {
        done: done,
        error: errorMessage
      }
    }, {
      new: true
    }, function (err, job) {
      if (err) reject(err);else if (!job) reject(new Error('Job id invalid, job not found.'));else incrementFailedStat(job.topic);
      resolve(job);
    });
  });
};

const resetQueue = function () {
  return new Promise((resolve, reject) => {
    QueueModel.remove({}, function (err) {
      if (err) reject(err);else resolve(true);
    });
  });
};

const cleanQueue = function () {
  return new Promise((resolve, reject) => {
    QueueModel.remove({
      $or: [{
        done: true
      }, {
        retries: {
          $gt: this.options.maxRetries
        }
      }]
    }, function (err) {
      if (err) reject(err);else resolve(true);
    });
  });
};

module.exports = {
  addJob,
  getJob,
  ackJob,
  errorJob,
  cleanQueue,
  resetQueue,
  fetchQueues
};