"use strict";

const QueueStatsModel = require('../models/QueueStatsModel');
const fetchQueueStats = function () {
  return new Promise((resolve, reject) => {
    QueueStatsModel.find({}).exec((err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
};
const incrementAddedStat = function (topic) {
  return new Promise((resolve, reject) => {
    QueueStatsModel.findOneAndUpdate({
      topic: topic
    }, {
      $inc: {
        added: 1
      }
    }, {
      new: true,
      upsert: true // Make this update into an upsert
    }).exec((err, doc) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(doc);
    });
  });
};
const incrementGottenStat = function (topic) {
  return new Promise((resolve, reject) => {
    QueueStatsModel.findOneAndUpdate({
      topic: topic
    }, {
      $inc: {
        gotten: 1
      }
    }, {
      new: true,
      upsert: true // Make this update into an upsert
    }).exec((err, doc) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(doc);
    });
  });
};
const incrementDoneStat = function (topic) {
  return new Promise((resolve, reject) => {
    QueueStatsModel.findOneAndUpdate({
      topic: topic
    }, {
      $inc: {
        done: 1
      }
    }, {
      new: true,
      upsert: true // Make this update into an upsert
    }).exec((err, doc) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(doc);
    });
  });
};
const incrementFailedStat = function (topic) {
  return new Promise((resolve, reject) => {
    QueueStatsModel.findOneAndUpdate({
      topic: topic
    }, {
      $inc: {
        failed: 1
      }
    }, {
      new: true,
      upsert: true // Make this update into an upsert
    }).exec((err, doc) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(doc);
    });
  });
};
const createTopic = function (topic) {
  return new Promise((resolve, reject) => {
    new QueueStatsModel({
      topic: topic
    }).exec(function (err, doc) {
      if (err) {
        reject(err);
        return;
      }
      resolve(doc);
    });
  });
};
module.exports = {
  incrementAddedStat,
  incrementGottenStat,
  incrementFailedStat,
  incrementDoneStat,
  createTopic,
  fetchQueueStats
};