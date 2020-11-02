const Queue = require('../src/queue/Queue')
const assert = require('assert');
const {AssertionError} = require('assert');


describe("Queue", () => {

    it('should get stats', async () => {

        let queue = new Queue()
        queue.reset()
        await queue.add('test', {number: '1'})
        await queue.add('test', {number: '2'})
        await queue.add('test', {number: '3'})

        let job1 = await queue.get('test', 'worker')
        let job2 = await queue.get('test', 'worker')
        await queue.ack(job2.id)

        let stats = await queue.stats()
        assert.equal(stats[0].added, 3)
        assert.equal(stats[0].gotten, 2)
        assert.equal(stats[0].done, 1)

    })


    it('Should accept a job if a topic and payload is provided', async () => {
        let queue = new Queue()
        let jobId = await queue.add('test', {name: 'some name'})
        console.log(jobId)
        assert.equal(typeof jobId, 'string')
        assert.notEqual(jobId, null)
    })

    it('should get a job', async () => {

        let queue = new Queue()
        queue.reset()

        let jobId = await queue.add('test', {name: 'some name'})

        let job = await queue.get('test', 'worker')
        assert.notEqual(job, null)
        assert.equal(jobId, job.id)

    })




})
