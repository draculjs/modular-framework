const config = require('./config-default')
const MongooseQueue = require('./mongoose-queue')

class ProducerManager{

    constructor(){
        this.producer = new MongooseQueue('producer', config)
    }

    addJob(topic, payload, cb){
        return this.producer.add(topic, payload, cb)
    }

}

module.exports = new ProducerManager()
