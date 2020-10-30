"use strict";

/**
 * Dependencies
 */
var os = require('os');

const _ = require('underscore');

const {
  addJob,
  getJob,
  ackJob,
  errorJob,
  cleanQueue,
  resetQueue
} = require('./services/QueueService');
/**
 * Implements a queue based on mongoose.
 *
 * @class MongooseQueue
 */


class MongooseQueue {
  /**
   * Creates an instance of MongooseQueue.
   * @param {string} [workerId='']
   * @param {Object} [options={}]
   */
  constructor(workerId = '', options = {}) {
    this.workerHostname = os.hostname();
    this.workerId = workerId;
    this.options = _.defaults(options, {
      blockDuration: 600000,
      //1 Hour
      maxRetries: 5
    });
  }
  /**
   * Adds an element to the queue.
   *
   * @param {string} topic
   * @param {Object} payload    - The payload to attach to this job. This needs to be a plain object.
   * @return {Promise}
   */


  add(topic, payload) {
    return new Promise((resolve, reject) => {
      addJob(topic, payload).then(job => {
        resolve(job._id.toString());
      }).catch(err => reject(err));
    });
  }
  /**
   * Get a job from the queue that is not done and not currentlich blocked.
   *
   * @param {string} topic
   * @return {Promise}
   */


  get(topic) {
    return new Promise((resolve, reject) => {
      getJob(topic, this.workerId, this.workerHostname, this.options.maxRetries, this.options.blockDuration).then(job => {
        resolve(job);
      }).catch(err => reject(err));
    });
  }
  /**
   * Mark a job as done.
   *
   * @param {string} jobId        - Id of the job to mark as done.
   * @return {Promise}
   */


  ack(jobId) {
    return new Promise((resolve, reject) => {
      ackJob(jobId).then(job => {
        resolve(job);
      }).catch(err => reject(err));
    });
  }
  /**
   * Mark a job done with an error message.
   *
   * @param {string} jobId    - Id of the job to mark with error.
   * @param {string} error    - Error message
   * @param {boolean} done    - Set the job as done
   * @return {Promise}
   */


  error(jobId, error, done = true) {
    return new Promise((resolve, reject) => {
      errorJob(jobId, error, done).then(job => {
        resolve(job);
      }).catch(err => reject(err));
    });
  }
  /**
   * Removes all jobs from the queue that are marked done (done/error) or reached the maximum retry count.
   *
   * @return {Promise}
   */


  clean() {
    return new Promise((resolve, reject) => {
      cleanQueue().then(result => {
        resolve(result);
      }).catch(err => reject(err));
    });
  }
  /**
   * Removes ALL jobs from the queue.
   *
   * @return {Promise}
   */


  reset() {
    return new Promise((resolve, reject) => {
      resetQueue().then(result => {
        resolve(result);
      }).catch(err => reject(err));
    });
  }

}

module.exports = MongooseQueue;