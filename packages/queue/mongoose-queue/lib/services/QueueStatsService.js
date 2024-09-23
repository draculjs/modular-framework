"use strict";

const QueueStatsModel = require('../models/QueueStatsModel');
const fetchQueueStats = async () => {
  try {
    const res = await QueueStatsModel.find({});
    return res;
  } catch (err) {
    throw err;
  }
};
const incrementAddedStat = async topic => {
  try {
    const doc = await QueueStatsModel.findOneAndUpdate({
      topic: topic
    }, {
      $inc: {
        added: 1
      }
    }, {
      new: true,
      upsert: true
    });
    return doc;
  } catch (err) {
    throw err;
  }
};
const incrementGottenStat = async topic => {
  try {
    const doc = await QueueStatsModel.findOneAndUpdate({
      topic: topic
    }, {
      $inc: {
        gotten: 1
      }
    }, {
      new: true,
      upsert: true
    });
    return doc;
  } catch (err) {
    throw err;
  }
};
const incrementDoneStat = async topic => {
  try {
    const doc = await QueueStatsModel.findOneAndUpdate({
      topic: topic
    }, {
      $inc: {
        done: 1
      }
    }, {
      new: true,
      upsert: true
    });
    return doc;
  } catch (err) {
    throw err;
  }
};
const incrementFailedStat = async topic => {
  try {
    const doc = await QueueStatsModel.findOneAndUpdate({
      topic: topic
    }, {
      $inc: {
        failed: 1
      }
    }, {
      new: true,
      upsert: true
    });
    return doc;
  } catch (err) {
    throw err;
  }
};
const createTopic = async topic => {
  try {
    const doc = await new QueueStatsModel({
      topic: topic
    }).save();
    return doc;
  } catch (err) {
    throw err;
  }
};
module.exports = {
  incrementAddedStat,
  incrementGottenStat,
  incrementFailedStat,
  incrementDoneStat,
  createTopic,
  fetchQueueStats
};