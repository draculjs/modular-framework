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
  maxRetries: {
    type: Number,
    default: 3,
    required: true,
    min: [1, 'Min maxRetries is 1']
  },
  // number of max retries
  retries: {
    type: Number,
    default: 0,
    required: true
  },
  // Show % job progress 0-100
  progress: {
    type: Number,
    default: 0,
    required: false,
    min: [0, 'Min progress is 0'],
    max: [100, 'Max progress is 100']
  },
  //Add info to the progress state
  progressDetail: {
    type: String,
    required: false
  },
  //State info about the job
  state: {
    type: String,
    required: false
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