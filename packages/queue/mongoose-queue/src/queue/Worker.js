/**
 * Dependencies
 */
const isFunction = require('../utils/isFunction')
const Consumer = require('./Consumer')
const EventEmitter = require('events');

/**
 * Implements a Worker.
 *
 * @class Worker
 */
class Worker {


    /**
     * Creates an instance of Worker.
     * @param {Consumer} consumer
     * @param {string} workerId
     * @param {Function} handler - The handler must be a function that return a promise
     * @param {Object} [options={}]
     */
    constructor(consumer, workerId, handler) {

        if (!consumer)
            throw new Error('consumer missing.')
        else if (!(consumer instanceof Consumer))
            throw new Error('consumer is not a Consumer instance.')

        if (!workerId)
            throw new Error('workerId missing.')
        else if (typeof workerId !== 'string')
            throw new Error('workerId is not a String.')

        if (!handler)
            throw new Error('handler missing.')
        else if (!isFunction(handler))
            throw new Error('handler is not a function.')

        this.consumer = consumer
        this.workerId = workerId
        this.handler = handler
        this.working = false
        this.running = false
        this.worksDone = 0
        this.worksFail = 0
        this.events = new EventEmitter();
    }

    on(event, handler) {

        if (!event)
            throw new Error('event missing.')
        else if (typeof event !== 'string')
            throw new Error('event is not a String.')

        if (!handler)
            throw new Error('handler missing.')
        else if (!isFunction(handler))
            throw new Error('handler is not a function.')

        this.events.on(event, handler)
    }

    /**
     * Run worker like a daemon
     * @param {number} waitTime
     */
    async run(waitTime) {
        this.running = true

        let time = waitTime ? waitTime : 10000
        if (!time instanceof Number)
            return Promise.reject(new Error('waitTime is not a Number.'))

        await this.runRecursive(time)
        return
    }

    /**
     * Stop run daemon
     */
    stop() {
        clearTimeout(this.runTimeout)
        this.running = false
    }


    async runRecursive(time) {
        if (!time instanceof Number)
            return Promise.reject(new Error('waitTime is not a Number.'))
        try {
            await this.work()
            if (!this.running)
                return
        } catch (e) {
            this.events.emit('runError', e)
            console.error(e)
        } finally {
            this.runTimeout = setTimeout(() => this.runRecursive(time), time)
        }
    }


    /**
     * Run worker until the queue is empty
     *
     * @param {number} waitTime
     */
    runUntilQueueIsEmpty(waitTime) {

        let time = waitTime ? waitTime : 10000
        if (!waitTime instanceof String)
            return Promise.reject(new Error('waitTime is not a Number.'))

        return new Promise(async (resolve, reject) => {
            setTimeout(async () => {
                this.work().then(job => {
                    if (job)
                        this.runUntilQueueIsEmpty(time).then(r => {
                            if (r === null)
                                resolve(null)
                        })
                    else
                        resolve(null)
                })
            }, time)
        })
    }

    /**
     * Get a job from the queue and call handler.
     *
     * @return {Promise}
     */
    work() {
        return new Promise((resolve, reject) => {
            this.working = true
            this.events.emit('workStart')
            this.consumer.get(this.workerId).then(async (job) => {
                if (!job) {
                    this.events.emit('workJobNotFound');
                    resolve(null)
                    return
                }

                this.events.emit('workGet', job)

                try {
                    //HANDLER WORK
                    await this.handler(job)

                    //ACK
                    this.consumer.ack(job.id)
                        .then(resp => {
                            this.events.emit('workAck', job)
                            this.worksDone++
                            resolve(job.id.toString())
                        })
                        .catch(e => reject(e))
                        .finally(() => this.working = false)

                } catch (e) {
                    //ERROR
                    this.worksFail++
                    this.events.emit('workError', job, e)
                    this.consumer.error(job.id, e.message)
                        .finally(() => {
                            this.working = false
                        })

                    reject(e)
                    return
                }
            }).catch(e => {
                this.events.emit('getJobError', e);
                reject(e);
                return;
            });
        })

    }

}


module.exports = Worker;
