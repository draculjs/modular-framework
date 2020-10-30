const configQueue = require('./config-default')
const MongooseQueue = require('./mongoose-queue')
const isFunction = require('./validations/isFunction')

class WorkerManager {

    constructor() {
        this.subscriptions = []
        this.workers = []
        this.daemon = null
    }

    clean() {
        this.subscriptions = []
        this.workers = []
    }

    unsubscribe(topic) {
        this.subscriptions = this.subscriptions.filter(s => s.topic === topic)
        this.workers = this.workers.filter(w => w.topic === topic)
    }

    subscribe(topic, handlerPromise) {

        return new Promise((resolve, reject) => {

            if (!topic) {
                reject(new Error('topic missing.'))
                return;
            } else if (typeof topic !== 'string') {
                reject(new Error('topic is not a String.'))
            }

            if (!handlerPromise) {
                reject(new Error('handlerPromise missing.'))
                return;

            } else if (!isFunction(handlerPromise)) {
                reject(new Error('handlerPromise is not a function.'))
                return;
            }

            let subscription = {
                topic: topic,
                handler: handlerPromise,
                worker: new MongooseQueue(topic)
            }


            this.subscriptions.push(subscription)

            resolve({
                status: 'subscribed',
                subscription: subscription
            })

        })

    }

    processJobByTopic(topic) {
        let subscription = this.subscriptions.find(worker => worker.topic === topic)
        return this.processJob(subscription)
    }

    processJob(subscription) {

        return new Promise((resolve, reject) => {

            //TODO: Improve validation
            if (!subscription) {
                reject(new Error("Subscription missing"))
            }


            subscription.worker.getByTopic(subscription.topic)
                .then(job => {

                    //Si obtuve un Job de la Queue
                    if (job) {

                        //El handler procesa el job
                        subscription.handler(job)
                            .then(result => {
                                if (result) {
                                    console.log("the job " + job.id + " with topic " + job.topic + " was completed successfully")
                                    //Notifico a la queue que el job se completo con exito
                                    subscription.worker.ack(job.id)
                                        .then(rjob => {
                                            console.log("the job " + rjob.id + " with topic " + rjob.topic + " done:" + rjob.done.toString())
                                            resolve("the job " + rjob.id + " with topic " + rjob.topic + " done:" + rjob.done.toString())
                                        })
                                        .catch(err => {
                                            console.error("Error when marking job as done", err)
                                            reject(err)
                                        })
                                }
                            })
                            .catch(err => {
                                console.error("the job " + job.id + " with topic " + job.topic + " fail with error:", err)
                                reject(err)
                            })
                    } else {
                        console.log("No job found in queue")
                        resolve(null)
                    }

                })
                .catch(err => {
                    console.error(err)
                    reject(err)
                })
        })

    }

    processJobs() {
        this.subscriptions.forEach(subscription => {
            this.processJob(subscription.topic)
        })
    }

    startDaemon(interval = 10000) {

        this.daemon = setInterval(this.processJobs, interval)

    }

    stopDaemon() {
        clearInterval(this.daemon)
    }

}

module.exports = new WorkerManager()
