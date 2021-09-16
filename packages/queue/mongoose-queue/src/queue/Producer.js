/**
 * Dependencies
 */
const _ = require('underscore');
const {addJob} = require('../services/QueueService')

/**
 * Implements a Producer
 *
 * @class Producer
 */
class Producer {
    /**
     * Creates an instance of Producer.
     * @param {string} topic
     * @param {Object} [options={}]
     */
    constructor(topic, options) {

        if (!topic)
            throw new Error('topic missing.')
        else if (typeof topic !== 'string')
            throw new Error('topic is not a String.')

        this.topic = topic

        this.options = _.defaults(options, {
            delayDuration: 0, //0 delay
        });

    }

    /**
     * Adds an element to the queue.
     *
     * @param {Object} payload    - The payload to attach to this job. This needs to be a plain object.
     * @param {number} delay      - The delay duration of the task
     * @return {Promise}
     */
    add(payload, delay, maxRetries = 3) {

        return new Promise((resolve, reject) => {

            let delayTask = delay ? delay : this.options.delayDuration
            addJob(this.topic, payload, delayTask)
                .then(job => {
                    resolve(job._id.toString());
                })
                .catch(err => reject(err))
        })

    }

}

module.exports = Producer;
