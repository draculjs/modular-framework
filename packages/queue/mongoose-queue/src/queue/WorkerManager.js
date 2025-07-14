/**
 * Dependencies
 */
import isFunction from '../utils/isFunction';
import Consumer from './Consumer';
import Worker from './Worker';

/**
 * Implements a WorkerManager.
 *
 * @class WorkerManager
 */
class WorkerManager {


    /**
     * Creates an instance of WorkerManager.
     * @param {Consumer} consumer
     * @param {string} workerId
     * @param {Function} handler - The handler must be a function that return a promise
     * @param {number} quantity - The number of workers to create
     * @param {Object} [options={}]
     */
    constructor(consumer, workerId, handler, quantity) {

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

        if (!quantity)
            throw new Error('workerQuantity missing.')
        else if (typeof quantity !== 'number')
            throw new Error('workerQuantity is not a number.')

        this.workers = []

        for (let i = 0; i < quantity; i++) {
            this.workers.push(new Worker(consumer, (workerId + "_" + i), handler))
        }
    }

    runWorkers(time) {
        this.workers.forEach(worker => {
            worker.run(time)
        })
    }

    stopWorkers() {
        this.workers.forEach(worker => {
            worker.stop()
        })
    }

}
