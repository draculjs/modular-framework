const Producer = require('../src/queue/Producer')
const assert = require('assert');
const {AssertionError} = require('assert');


describe("Producer", () => {


    it('should fail if no topic is provided ', async () => {
        try {
            let producer = new Producer()
            assert.fail('expected exception not thrown')
        }catch (e) {
            if (e instanceof AssertionError) {
                throw e;
            }
            assert.equal(e.message, 'topic missing.');
        }
    })

    it('should fail if payload is not provided on add ', async () => {
        let producer = new Producer('test')
        assert.rejects(producer.add(null), {name: 'Error', message: 'Payload missing.'})
    })



    it('should fail if payload is not a plain object', async () => {
        let producer = new Producer('test')
        assert.rejects(producer.add('test', 'no soy un plain object'),
            {name: 'Error', message: 'Payload is not a plain object.'})
    })

    it('Should accept a job if a topic and payload is provided', async () => {

        let producer = new Producer('test')

        let jobId = await producer.add( {name: 'some name'})
        console.log(jobId)


        assert.equal(typeof jobId, 'string')
        assert.notEqual(jobId, null)

    })

})
