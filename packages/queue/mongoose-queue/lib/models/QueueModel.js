"use strict";

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const QueueSchema = new Schema({
  // time until the job is blocked for processing
  blockedUntil: {
    type: Date,
    default: Date.now(),
    required: false
  },
  // Id of the worker currently blocking/processing the job
  workerId: {
    type: String,
    required: false
  },
  // number of retries
  retries: {
    type: Number,
    default: 0,
    required: true
  },
  // Topic is way to diferenciate types of jobs
  topic: {
    type: String,
    required: true
  },
  // Payload is a reference to another mongoose object
  payload: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  // Is the job done or not (Does not matter if successful or not)
  done: {
    type: Boolean,
    default: false,
    required: true
  },
  // last error that occured while processing
  error: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});
const Queue = mongoose.model('Queue', QueueSchema);
module.exports = Queue;