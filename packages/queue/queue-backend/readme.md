# Dracul Mongoose Queue

A simple mongoose queue module. The module offer a producer and worker manager to facilitate and accelerate implementation, however you can use you our implementation using the MongooseQueue Class. 


## Add job to queue

In order to add a job to the queue you need to import producerManager and call addJob method that require two params, a topic string that identify the type of job and a plain object payload with the data necesary to process the job.


### Example
```$xslt
const {producerManager} = require('@dracul/queue-backend')
producerManager.addJob('topico',{data: "some data})
```

## Subscribre a function handler to topic 
In order to register a function handler that has the logic to process some topic job you need to import de workerManager and call subscribe method

**Important**: The function handler must be a function that recibe the job payload and return a promise that resolve true if the jobs is completed successfully

### Example
```js
const {workerManager} = require('@dracul/queue-backend')
let suscription = workerManager.subscribe(
                        'someTopicName', 
                        function (jobPayload){ 
                            return new Promise(resolve) => {
                                //Do job stuff
                                resolve(true)
                            }       
                        })
console.log(suscription)  //{status: 'subscribed', worker: {topic: 'someTopicName', workerInstance: <MongooseQueue>} }
```

## Process job by topic
In order to process a job by topic, first you need to subscribe a handler and next you can call processJobByTopic method with a topicName from workerManager 

```js
const {workerManager} = require('@dracul/queue-backend')
workerManager.processJobByTopic('someTopicName')
```

## Process jobs for all workers register
In order to process one job of each worker register, call processJobs method of workerManger

```js
const {workerManager} = require('@dracul/queue-backend')
workerManager.processJobs()
```

### Start Worker Deamon (Process jobs beteween intervals)

```js
const {workerManager} = require('@dracul/queue-backend')
workerManager.startDaemon(10000) //10000 ms is the interval
```

**Cancel**:

```js
const {workerManager} = require('@dracul/queue-backend')
workerManager.cancelDaemon()
```
