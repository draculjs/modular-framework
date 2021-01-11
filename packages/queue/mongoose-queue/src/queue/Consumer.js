/**
 * Dependencies
 */
const _ = require('underscore');
const {getJob, ackJob, errorJob} = require('../services/QueueService')

/**
 * Implements a Consumer.
 *
 * @class Consumer
 */
class Consumer {


    /**
     * Creates an instance of Consumer.
     * @param {string} topic
     * @param {Object} [options={}]
     */
    constructor(topic, options = {blockDuration:600000, maxRetries: 3}) {
        if (!topic)
            throw new Error('topic missing.')
        else if (typeof topic !== 'string')
            throw new Error('topic is not a String.')

        this.topic = topic

        this.options = _.defaults(options, {
            blockDuration: 600000, //Default: 10 minutes
            maxRetries: 3,
        })
    }

    /**
     * Get the topic of the consumer
     *
     * @return {string}
     */
    getTopic(){
        return this.topic
    }

    /**
     * Get a job from the queue that is not done and not currentlich blocked.
     *
     * @param {string} topic
     * @return {Promise}
     */
    get(workerId) {
        return new Promise((resolve, reject) => {
            getJob(
                this.topic,
                workerId,
                this.options.maxRetries,
                this.options.blockDuration
            )
                .then(job => {
                    resolve(job)
                })
                .catch(err => reject(err))
                .finally()
        })
    }

    /**
     * Mark a job as done.
     *
     * @param {string} jobId        - Id of the job to mark as done.
     * @return {Promise}
     */
    ack(jobId) {
        return new Promise((resolve, reject) => {
            ackJob(jobId)
                .then(job => {
                    resolve(job)
                })
                .catch(err => reject(err))
        })
    }

    /**
     * Mark a job done with an error message.
     *
     * @param {string} jobId    - Id of the job to mark with error.
     * @param {string} error    - Error message
     * @param {boolean} done    - Set the job as done
     * @return {Promise}
     */
    error(jobId, error, done = false) {
        return new Promise((resolve, reject) => {
            errorJob(jobId, error, done)
                .then(job => {
                    resolve(job)
                })
                .catch(err => reject(err))

        })
    }



}

module.exports = Consumer;
