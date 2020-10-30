const configQueue = require('./config-default')
const MongooseQueue = require('./mongoose-queue')
const isFunction = require('./validations/isFunction')

class WorkerManager {

    constructor() {
        this.subscriptions = []
        this.workers = []
        this.daemon = null
    }

    clean(){
        this.subscriptions = []
        this.workers = []
    }

    unsubscribe(topic) {
        this.subscriptions = this.subscriptions.filter(s => s.topic === topic)
        this.workers = this.workers.filter(w => w.topic === topic)
    }

    subscribe(topic, handlerPromise) {

        return new Promise((resolve, reject) => {

            if (!topic)
                reject(new Error('topic missing.'))
            else if (typeof topic !== 'string')
                reject(new Error('topic is not a String.'))

            if (!handlerPromise)
                reject(new Error('handlerPromise missing.'))
            else if (!isFunction(handlerPromise))
                reject(new Error('handlerPromise is not a function.'))

            let subscription = {
                topic: topic,
                handler: handlerPromise
            }

            console.log(subscription)
            this.subscriptions.push(subscription)

            let worker = this.addWorker(topic)

            resolve({
                status: 'subscribed',
                worker: worker,
                subscription: subscription
            })

        })

    }

    addWorker(topic) {
        let workerInstance = new MongooseQueue(topic)
        let worker = {
            topic: topic,
            workerInstance: workerInstance
        }
        this.workers.push(worker)
        return worker
    }

    processJobByTopic(topic) {
        let worker = this.workers.find(worker => worker.topic === topic)
        return this.processJobByWorker(worker)
    }

    processJobByWorker(worker) {
        return new Promise((resolve, reject) => {

            worker.workerInstance.getByTopic(worker.topic)
                .then(job => {

                    //Si obtuve un Job de la Queue
                    if (job) {
                        let subscription = this.subscriptions.find(sub => sub.topic === job.topic)

                        if (!subscription) {
                            reject(new Error("Subscription not found"))
                        }

                        console.log(subscription)

                        //El handler procesa el job
                        subscription.handler(job)
                            .then(result => {
                                if (result) {
                                    console.log("the job " + job.id + " with topic " + job.topic + " was completed successfully")
                                    //Notifico a la queue que el job se completo con exito
                                    worker.workerInstance.ack(job.id)
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
        this.workers.forEach(worker => {
            this.processJobByWorker(worker)
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
