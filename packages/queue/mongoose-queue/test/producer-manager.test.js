const producerManager = require('../src/producer-manager')
var assert = require('assert');


describe("Producer", () => {


    it('should fail if no payload is provided ', async () => {
        assert.rejects(producerManager.addJob('test', null), {name: 'Error', message: 'Payload missing.'})
    })

    it('should fail if no topic is provided ', async () => {
        assert.rejects(producerManager.addJob(), {name: 'Error', message: 'Topic missing.'})
    })

    it('should fail if payload is not a plain object', async () => {
        assert.rejects(producerManager.addJob('test', 'no soy un plain object'),
            {name: 'Error', message: 'Payload is not a plain object.'})
    })

    it('Should accept a job if a topic and payload is provided', async () => {
        let jobId = await producerManager.addJob('test', {name: 'test'})
        console.log(jobId)
        assert.equal(typeof jobId, 'string')
        assert.notEqual(jobId, null)
    })

})
