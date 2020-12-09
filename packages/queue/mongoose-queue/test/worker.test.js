const Worker = require('../src/queue/Worker')
const Consumer = require('../src/queue/Consumer')
const Producer = require('../src/queue/Producer')
var assert = require('assert');
const {AssertionError} = require('assert');
var sinon = require('sinon')

describe("Worker", () => {


    it('should fail if consumer is not provided ', async () => {
        try {
            let worker = new Worker()
            assert.fail('expected exception not thrown')
        } catch (e) {
            if (e instanceof AssertionError) {
                throw e;
            }
            assert.equal(e.message, 'consumer missing.');
        }
    })

    it('should fail if workerId is not provided ', async () => {
        try {
            let consumer = new Consumer('test')
            let worker = new Worker(consumer)
            assert.fail('expected exception not thrown')
        } catch (e) {
            if (e instanceof AssertionError) {
                throw e;
            }
            assert.equal(e.message, 'workerId missing.');
        }
    })

    it('should fail if handler is not provided ', async () => {
        try {
            let consumer = new Consumer('test')
            let worker = new Worker(consumer, '123')
            assert.fail('expected exception not thrown')
        } catch (e) {
            if (e instanceof AssertionError) {
                throw e;
            }
            assert.equal(e.message, 'handler missing.');
        }
    })


    it('should fail if consumer is not a Consumer instance', async () => {
        try {
            let worker = new Worker(666)
            assert.fail('expected exception not thrown')
        } catch (e) {
            if (e instanceof AssertionError) {
                throw e;
            }
            assert.equal(e.message, 'consumer is not a Consumer instance.');
        }
    });

    it('should fail if workerId is not a string ', async () => {
        try {
            let consumer = new Consumer('test')
            let worker = new Worker(consumer, 666)
            assert.fail('expected exception not thrown')
        } catch (e) {
            if (e instanceof AssertionError) {
                throw e;
            }
            assert.equal(e.message, 'workerId is not a String.');
        }
    });

    it('should fail if handler is not a function ', async () => {
        try {
            let consumer = new Consumer('test')
            let worker = new Worker(consumer, '123', 'handler')
            assert.fail('expected exception not thrown')
        } catch (e) {
            if (e instanceof AssertionError) {
                throw e;
            }
            assert.equal(e.message, 'handler is not a function.');
        }
    });

    it('should create Worker if consumer, workerId and handler is provided ', async () => {

        const handler = (job) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log("Handler Job:", job)
                    resolve(true)
                }, 500)
            })
        }
        let consumer = new Consumer('test',)

        let worker = new Worker(consumer, '123', handler)

        assert(worker instanceof Worker)

    });


    it('should get null work job when queue is empty', async () => {

        const handler = (job) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log("Handler Job:", job)
                    resolve(true)
                }, 50)
            })
        }

        let consumer = new Consumer('test')
        let worker = new Worker(consumer, '123', handler)
        //3. Process the Job

        let job = await worker.work()

        assert.equal(job, null)

    })

    it('should get a job', async () => {

        //1. Add some jobs to queue
        let producer = new Producer('test')
        let jobId = await producer.add({name: 'some name'})

        //2. Create Consumer
        const handler = (job) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log("Handler Job:", job)
                    resolve(true)
                }, 50)
            })
        }

        let consumer = new Consumer('test')
        let worker = new Worker(consumer, '123', handler)

        //3. Process the Job
        let job = await worker.work()
        assert.notEqual(job, null)

    })

    it('should emit events', (done) => {

        //1. Add some jobs to queue
        let producer = new Producer('test')
        producer.add({name: 'some name'})

        //2. Create Consumer
        const handler = (job) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log("Handler Job:", job)
                    resolve(true)
                }, 50)
            })
        }

        let consumer = new Consumer('test')
        let worker = new Worker(consumer, '123', handler)

        worker.on('workStart',()=> {
            console.log('workStart')
            assert(true)
            done()
            }
        )

        //3. Process the Job
        worker.work()

    })

    it('should run consumer and process all queued jobs', async () => {

        //1. Add some jobs to queue
        let producer = new Producer('test')
        await producer.add({number: 1})
        await producer.add({number: 2})
        await producer.add({number: 3})

        //2. Create Consumer
        const handler = (job) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log("Handler Job:", job)
                    resolve(true)
                }, 10)
            })
        }

        let consumer = new Consumer('test')
        let worker = new Worker(consumer, '123', handler)

        let done = await worker.runUntilQueueIsEmpty(100)
        assert.equal(done, null)
    })

    it('should run consumer until stop him',  (done) => {

        //1. Add some jobs to queue
        let producer = new Producer('test')
         producer.add({number: 1})
         producer.add({number: 2})
         producer.add({number: 3})

        //2. Create Consumer
        const handler = (job) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log("Handler Job:", job)
                    resolve(true)
                }, 1)
            })
        }

        let consumer = new Consumer('test')
        let worker = new Worker(consumer, '123', handler)


        worker.run(100)

        setTimeout(() => {
            worker.stop()
            assert.equal(worker.worksDone, 3)
            done()
        }, 500)


    })

})
