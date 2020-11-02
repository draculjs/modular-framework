/**
 * Dependencies
 */
const _ = require('underscore');
const {addJob, getJob, ackJob, errorJob, cleanQueue, resetQueue} = require('../services/QueueService')
const {fetchQueueStats} = require('../services/QueueStatsService')

/**
 * Implements a queue based on mongoose.
 *
 * @class Queue
 */
class Queue {
    /**
     * Creates an instance of Queue.
     * @param {Object} [options={}]
     */
    constructor(options = {}) {

        this.options = _.defaults(options, {
            blockDuration: 600000, //1 Hour
            maxRetries: 5,
            delayDuration: 0
        });

    }

    /**
     * Adds an element to the queue.
     *
     * @param {string} topic
     * @param {Object} payload    - The payload to attach to this job. This needs to be a plain object.
     * @param {number} delay      - The delay duration of the task
     * @return {Promise}
     */
    add(topic, payload, delay) {
        let delayTask = delay ? delay : this.options.delayDuration
        return new Promise((resolve, reject) => {

            addJob(topic, payload, delayTask)
                .then(job => {
                    resolve(job._id.toString());
                })
                .catch(err => reject(err))
        })

    }


    /**
     * Get a job from the queue that is not done and not currentlich blocked.
     *
     * @param {string} topic
     * @return {Promise}
     */
    get(topic, workerId) {
        return new Promise((resolve, reject) => {

            getJob(
                topic,
                workerId,
                this.options.maxRetries,
                this.options.blockDuration
            )
                .then(job => {
                    resolve(job)
                })
                .catch(err => reject(err))

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
    error(jobId, error, done = true) {
        return new Promise((resolve, reject) => {
            errorJob(jobId, error, done)
                .then(job => {
                    resolve(job)
                })
                .catch(err => reject(err))

        })
    }

    /**
     * Removes all jobs from the queue that are marked done (done/error) or reached the maximum retry count.
     *
     * @return {Promise}
     */
    clean() {

        return new Promise((resolve, reject) => {
            cleanQueue()
                .then(result => {
                    resolve(result)
                })
                .catch(err => reject(err))

        })


    }

    /**
     * Removes ALL jobs from the queue.
     *
     * @return {Promise}
     */
    reset() {
        return new Promise((resolve, reject) => {
            resetQueue()
                .then(result => {
                    resolve(result)
                })
                .catch(err => reject(err))

        })
    }

    stats(){
        return new Promise((resolve, reject) => {
            fetchQueueStats()
                .then(result => {
                    resolve(result)
                })
                .catch(err => reject(err))

        })
    }
}

module.exports = Queue;
