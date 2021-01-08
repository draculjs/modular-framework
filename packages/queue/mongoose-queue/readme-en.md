# Dracul Mongoose Queue

Javascript queuing system supported on mongodb and mongoose.

## Funcionalidades
- Produce and consume jobs
- Mark jobs as finished
- Can log errors in the execution of tasks  
- Segmentation by topics to handle different types of tasks 
- Posibility to add delay to tasks to postpone their execution
- Get statistics from the queue. Tasks: Added, Taken, Finished.

#Classes

- Producer
- Consumer
- Queue
- Worker
- WorkerManager

## Producer
Allows adding tasks to the queue

###Method: _constructor_
Initialize a Producer instance  

**Parameters**:  
    - {string} **topic**: name of the topic that identifies the type of task
    
**Example**: 
```js
const {Producer} = require('@dracul/mongoose-queue')
let producer = new Producer('test')
```
    
###Method: _add_
Add a job to the queue

**Parameters**:  
    - {Plain Object} **payload**: information for task processing   

**Return**: {String} ObjectId of the document in MongoDB

**Example**: 

```js
const {Producer} = require('@dracul/mongoose-queue')
let producer = new Producer('test')
let jobId = await producer.add( {data: 'somedata'} )
```


## Consumer
Get tasks from the queue

###Method: _constructor_
Initialize a Consumer instance  
**Parameters**:  
- {string} **topic**: name of the topic that identifies the type of task
    
**Example**: 
```js
const {Consumer} = require('@dracul/mongoose-queue')
let consumer = new Consumer('test')
```

###Method: _get_  
Get a job from the queue

**Parameters**:  
- {string} **workerId**: identifier of the worker that takes the task 

**Return**: {Object|null} Object with all job data or null if there are no pending tasks in the queue

**Example**: 

```js
const {Consumer} = require('@dracul/mongoose-queue')
let consumer = new Consumer('test')
let job = await consumer.get('worker')
```

###Method: _ack_  
Mark a job as done

**Parameters**:  
- {string} **jobId**: job identifier

**Return**: {Object} Object with all job data

**Example**: 

```js
const {Consumer} = require('@dracul/mongoose-queue')
let consumer = new Consumer('test')
let job = await consumer.get('worker')
//...Process job...
job = await consumer.ack(job.id)
```

###Method: _error_  
Mark a job with error

**Parameters**:  
- {string} **jobId**: job identifier
- {string} **errorMessage**: message with the error logged

**Return**: {Object} Object with all job data

**Example**: 

```js
const {Consumer} = require('@dracul/mongoose-queue')
let consumer = new Consumer('test')
let job = await consumer.get('worker')
//...Procesar trabajo...
job = await consumer.error(job.id,"FatalError")
```

## Worker
Create workers that consume and process tasks from the queue

###Method: _constructor_
Initialize a Worker instance  
**Parameters**:  
- {Consumer} **consumer**: Consumer instance
- {string} **workerId**: Worker identifier
- {function} **handler**: Function to process the job
    
**Example**: 
```js
const {Consumer,Worker} = require('@dracul/mongoose-queue')
let consumer = new Consumer('test')
const handler = (payload)=>{console.log(payload)}
let worker = new Worker(consumer,'worker1',handler)
```

###Method: _work_
Get a task from the queue and process it with the handler function

**Parameters**:  
No parameters
    
**Example**: 
```js
const {Consumer,Worker} = require('@dracul/mongoose-queue')
let consumer = new Consumer('test')
const handler = (payload)=>{console.log(payload)}
let worker = new Worker(consumer,'worker1',handler)
worker.work()
```


###Method: _run_
Run the worker as a daemon. The worker will execute the Method "work" continuously with a time interval

**Parameters**:  
- {number} waitTime: Waiting time in milliseconds (ms) between job execution
    
**Example**: 
```js
const {Consumer,Worker} = require('@dracul/mongoose-queue')
let consumer = new Consumer('test')
const handler = (payload)=>{console.log(payload)}
let worker = new Worker(consumer,'worker1',handler)
worker.run(10000)
```


###Metodo: _stop_
Stops the worker daemon

**Argumentos**:  
No parameters
   
**Example**: 
```js
const {Consumer,Worker} = require('@dracul/mongoose-queue')
let consumer = new Consumer('test')
const handler = (payload)=>{console.log(payload)}
let worker = new Worker(consumer,'worker1',handler)
worker.run(10000)
//...
worker.stop()
```


###Method: _on_
The worker allows subscribing to an EventEmitter with the following events


**Eventos**:  
- **workStart**: The worker starts a job
- **workGet**: El worker obtiene un trabajo de la cola
- **workAck**: The worker finishes a job
- **workError**: The worker logs an error in a job
    
**Example**: 
```js
const {Consumer,Worker} = require('@dracul/mongoose-queue')
let consumer = new Consumer('test')
const handler = (payload)=>{console.log(payload)}
let worker = new Worker(consumer,'worker1',handler)

worker.on('workStart',()=>{
console.log("The worker starts a job")
})

worker.on('workGet',(job)=>{
console.log("The worker takes a job", job)
})

worker.on('workAck',(job)=>{
console.log("The worker finishes a job", job)
})

worker.on('workError',(job, error)=>{
console.log("The worker logs an error in a job", job,  error)
})

worker.run(10000)
```