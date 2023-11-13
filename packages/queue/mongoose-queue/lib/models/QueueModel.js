"use strict";

var _commonBackend = require("@dracul/common-backend");
const Schema = _commonBackend.mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');
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
  info: {
    type: String,
    required: false
  },
  //Final output. Ex: A link to result file
  output: {
    type: String,
    required: false
  },
  //Data for custom progress status
  data: {
    type: String,
    required: false
  },
  //State info about the job
  state: {
    type: String,
    default: 'PENDING',
    required: false
  },
  // Topic is way to diferenciate types of jobs
  topic: {
    type: String,
    required: true
  },
  // Payload is a reference to another mongoose object
  payload: {
    type: _commonBackend.mongoose.Schema.Types.Mixed,
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
QueueSchema.plugin(mongoosePaginate);
const QueueModel = _commonBackend.mongoose.model('Queue', QueueSchema);
module.exports = QueueModel;