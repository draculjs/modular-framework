const Consumer = require('../src/queue/Consumer')
const Producer = require('../src/queue/Producer')
var assert = require('assert');
const {AssertionError} = require('assert');

describe("Consumer", () => {


    it('should fail if topic is not provided ', async () => {
        try {
            let consumer = new Consumer()
            assert.fail('expected exception not thrown')
        }catch (e) {
            if (e instanceof AssertionError) {
                throw e;
            }
            assert.equal(e.message, 'topic missing.');
        }
    })

    it('should fail if topic is not a string ', async () => {
        try {
            let consumer = new Consumer(666)
            assert.fail('expected exception not thrown')
        }catch (e) {
            if (e instanceof AssertionError) {
                throw e;
            }
            assert.equal(e.message, 'topic is not a String.');
        }
    });


    it('should create Consumer if topic is provided ', async () => {

        let consumer = new Consumer('test')

        assert(consumer instanceof Consumer)

    });


    it('should get null job when queue is empty', async () => {
        let consumer = new Consumer('test',)
        let job = await consumer.get('worker')
        assert.equal(job, null)
    })

    it('should get a job', async () => {

        //1. Create a Producer and Add Job to queue
        let producer = new Producer('test')
        let jobId = await producer.add( {name: 'some name'})

        //2. Create Consumer
        let consumer = new Consumer('test')

        //3. Get the Job
        let job = await consumer.get('worker')
        assert.notEqual(job, null)
        assert.equal(jobId,job.id)

    })


    it('should done be true if ack a job', async () => {

        //1. Create a Producer and Add Job to queue
        let producer = new Producer('test')
        let jobId = await producer.add( {name: 'some name'})

        //2. Create Consumer
        let consumer = new Consumer('test')

        //3. Get the Job
        let job = await consumer.get('worker')
        assert.notEqual(job, null)
        assert.equal(jobId,job.id)

        let jobAck = await consumer.ack(job.id)
        assert.equal(jobAck.done,true)
    })

    it('should get error message from a error job', async () => {

        //1. Create a Producer and Add Job to queue
        let producer = new Producer('test')
        let jobId = await producer.add( {name: 'some name'})

        //2. Create Consumer
        let consumer = new Consumer('test')

        //3. Get the Job
        let job = await consumer.get('worker')
        assert.notEqual(job, null)
        assert.equal(jobId,job.id)

        let jobError= await consumer.error(job.id,'FatalError')
        assert.equal(jobError.error,'FatalError')
    })

})
