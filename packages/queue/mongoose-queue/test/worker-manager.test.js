const workerManager = require('../src/worker-manager')
const producerManager = require('../src/producer-manager')
var assert = require('assert');


describe("WorkerManager", () => {

    /*
    afterEach(function(){
           workerManager.clean()
      })
    */


    it('should fail if topic is not provided ', async () => {
        assert.rejects(workerManager.subscribe(), {name: 'Error', message: 'topic missing.'})
    });

    it('should fail if handler is not provided ', async () => {
        assert.rejects(workerManager.subscribe('test'), {name: 'Error', message: 'handlerPromise missing.'})
    });

    it('should fail if topic is not a string ', async () => {
        assert.rejects(workerManager.subscribe(666), {name: 'Error', message: 'topic is not a String.'})
    });

    it('should fail if handler is not a function ', async () => {
        assert.rejects(workerManager.subscribe('test', 666), {
            name: 'Error',
            message: 'handlerPromise is not a function.'
        })
    });

    it('should suscribe if topic and handler is provided ', async () => {

        const handler = (job) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log("Handler Job:", job)
                    resolve(true)
                }, 500)
            })
        }
        let result = await workerManager.subscribe('testSubscribe', handler)

        assert.equal(result.status, 'subscribed')

    });


    it('should recibe null job when queue is empty', async () => {

        const handlerPromise = (job) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log("Handler Job:", job)
                    resolve(true)
                }, 50)
            })
        }

        let subscription = await workerManager.subscribe('test', handlerPromise)

        assert.equal(subscription.status, 'subscribed')

        //3. Process the Job

        let result = await workerManager.processJobByTopic('test')

        assert.equal(result, null)

    })

    it('should process one job', async () => {

        //1. Add some jobs to queue
        await producerManager.addJob('test', {code: 123})

        //2. Simulate a handler for the previous job
        const handlerPromise = (job) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log("Handler Job:", job)
                    resolve(true)
                }, 50)
            })
        }

        let subscription = await workerManager.subscribe('test', handlerPromise)

        assert.equal(subscription.status, 'subscribed')

        //3. Process the Job

        let result = await workerManager.processJobByTopic('test')

        assert.notEqual(result, null)

    });

})
