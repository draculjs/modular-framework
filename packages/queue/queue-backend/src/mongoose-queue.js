'use strict';

/**
 * Dependencies
 */
var os = require('os');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Schema = mongoose.Schema;
const _ = require('underscore');
const QueueSchema = require('./schemas/queue-schema');
const isPlainObject = require('./validations/isPlainObject')


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
            payloadRefType: Schema.Types.ObjectId,
            queueCollection: 'queue',
            blockDuration: 30000,
            maxRetries: 5
        });

        // create job model
        const queueCollection = this.options.queueCollection ? this.options.queueCollection : 'queue'
        this.JobModel = QueueSchema(queueCollection);
    }

    /**
     * Adds an element to the queue.
     *
     * @param {any} payload                - The payload to attach to this job. This needs to be a Mongoose document.
     * @param {fn(err, jobId)} cb        - Callback either returning an error or the id of the job added to the queue.
     */
    add(topic, payload) {

        return new Promise((resolve, reject) => {

            if (!topic) {
                reject(new Error('Topic missing.'))
                return
            } else if (!topic instanceof String) {
                reject(new Error('Topic is not a String.'))
                return
            }


            if (!payload) {
                reject(new Error('Payload missing.'));
                return
            } else if (!isPlainObject(payload)) {
                reject(new Error('Payload is not a plain object.'))
                return
            }


            // add to queue
            var newJob = new this.JobModel({
                topic: topic,
                payload: payload
            })
                .save(function (err, job) {
                    if (err)
                        reject(err);
                    else
                        resolve(job._id.toString());
                });
        })

    }


    /**
     * Get a job from the queue that is not done and not currentlich blocked.
     *
     * @param {String} topic
     * @return {Promise}
     */
    getByTopic(topic) {
        return new Promise((resolve, reject) => {

            if (!topic) {
                reject(new Error('Topic missing.'))
                return
            } else if (!topic instanceof String) {
                reject(new Error('Topic is not a String.'))
                return
            }

            this.JobModel
                .findOneAndUpdate({
                    topic: topic,
                    blockedUntil: {$lt: Date.now()},
                    retries: {$lte: this.options.maxRetries},
                    done: false
                }, {
                    $set: {
                        blockedUntil: new Date(Date.now() + this.options.blockDuration),
                        workerId: this.workerId,
                        workerHostname: this.workerHostname
                    },
                    $inc: {
                        retries: 1
                    },
                }, {
                    new: true,
                    sort: {createdAt: 1}
                })
                .exec(function (err, job) {

                    if (err) {
                        reject(err);
                        return
                    } else if (!job) {
                        resolve(null);
                    } else {
                        resolve({
                            id: job._id,
                            topic: job.topic,
                            payload: job.payload,
                            blockedUntil: job.blockedUntil,
                            done: job.done
                        })
                    }
                });

        })

    }

    /**
     * Get a job from the queue that is not done and not currentlich blocked.
     *
     * @param {fn(err, job)} cb    - Callback with error or job fetched from queue for processing.
     */
    get(cb) {
        // fetch the oldest job from the queue that
        // is not blocked, is not done
        // then increase blockedUntil and return it
        this.JobModel
            .findOneAndUpdate({
                blockedUntil: {$lt: Date.now()},
                retries: {$lte: this.options.maxRetries},
                done: false
            }, {
                $set: {
                    blockedUntil: new Date(Date.now() + this.options.blockDuration),
                    workerId: this.workerId,
                    workerHostname: this.workerHostname
                },
                $inc: {
                    retries: 1
                },
            }, {
                new: true,
                sort: {createdAt: 1}
            })
            .populate({path: 'payload', model: this.payloadModel})
            .exec(function (err, job) {
                /* istanbul ignore if */
                if (err)
                    return cb(err, null);
                else if (!job)
                    return cb(null, null);
                else {
                    cb(null, {
                        id: job._id,
                        payload: job.payload,
                        blockedUntil: job.blockedUntil,
                        done: job.done
                    });
                }
            });
    }

    /**
     * Mark a job as done.
     *
     * @param {String} jobId        - Id of the job to mark as done.
     * @param {fn(err, job)} cb        - Callback with error or updated job.
     */
    ack(jobId) {

        return new Promise((resolve, reject) => {
            this.JobModel.findOneAndUpdate({
                _id: jobId
            }, {
                $set: {
                    done: true
                }
            }, {
                new: true
            }, function (err, job) {
                if (err) {
                    reject(err)
                    return
                } else if (!job) {
                    reject(new Error('Job id invalid, job not found.'))
                    return
                } else
                    resolve({
                        id: job._id,
                        payload: job.payload,
                        topic: job.topic,
                        blockedUntil: job.blockedUntil,
                        done: job.done
                    })
            });

        })

    }

    /**
     * Mark a job done with an error message.
     *
     * @param {String} jobId    - Id of the job to mark with error.
     * @param {String} error    - Error message
     * @param {fn(err, job)} cb    - Callback with error or updated job.
     */
    error(jobId, error, cb) {
        this.JobModel.findOneAndUpdate({
            _id: jobId
        }, {
            $set: {
                done: true,
                error: error
            }
        }, {
            new: true
        }, function (err, job) {
            /* istanbul ignore if */
            if (err)
                return cb(err, null);
            else if (!job)
                return cb(new Error('Job id invalid, job not found.'), null);
            else
                cb(null, {
                    id: job._id,
                    payload: job.payload,
                    blockedUntil: job.blockedUntil,
                    done: job.done,
                    error: job.error
                });
        });
    }

    /**
     * Removes all jobs from the queue that are marked done (done/error) or reached the maximum retry count.
     *
     * @param {fn(err)} cb - Callback with null when successful, otherwise the error is passed.
     */
    clean(cb) {
        this.JobModel.remove({
            $or: [
                {done: true},
                {retries: {$gt: this.options.maxRetries}}
            ]
        }, function (err) {
            /* istanbul ignore if */
            if (err)
                return cb(err);
            else
                cb(null);
        });
    }

    /**
     * Removes ALL jobs from the queue.
     *
     * @param {fn(err)} cb - Callback with null when successful, otherwise the error is passed.
     */
    reset(cb) {
        this.JobModel.remove({}, function (err) {
            /* istanbul ignore if */
            if (err)
                return cb(err);
            else
                cb(null);
        });
    }
}

module.exports = MongooseQueue;
