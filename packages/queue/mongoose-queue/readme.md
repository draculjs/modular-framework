# Dracul Mongoose Queue

Sistema de colas de javascript soportado sobre mongodb y mongoose.

## Funcionalidades
- Producir y consumir tareas
- Marcar tareas como terminadas
- Poder registrar errores en la ejecución de tareas  
- Segmentacion por topicos para manejar diferente tipo de tareas 
- Posibilidad de agregar retraso a las tareas para posponer su ejecución
- Obtener estadisticas de la cola. Tareas: Agregadas, Tomadas, Terminadas.

#Classes

- Producer
- Consumer
- Queue
- Worker
- WorkerManager

## Producer
Permite agregar tareas a la cola

###Metodo: _constructor_
Inicializa una instancia de Producer  

**Argumentos**:  
    - {string} **topic**: nombre del topico que identifica el tipo de tarea
    
**Ejemplo**: 
```js
const {Producer} = require('@dracul/mongoose-queue')
let producer = new Producer('test')
```
    
###Metodo: _add_
Agregar un trabajo a la cola

**Argumentos**:  
    - {Plain Object} **payload**: información para el procesamiento de la tarea   

**Retorna**: {String} ObjectId del documento en MongoDB

**Ejemplo**: 

```js
const {Producer} = require('@dracul/mongoose-queue')
let producer = new Producer('test')
let jobId = await producer.add( {data: 'somedata'} )
```


## Consumer
Permite obtener tareas de la cola

###Metodo: _constructor_
Inicializa una instancia de Consumer  
**Argumentos**:  
- {string} **topic**: nombre del topico que identifica el tipo de tarea
    
**Ejemplo**: 
```js
const {Consumer} = require('@dracul/mongoose-queue')
let consumer = new Consumer('test')
```

###Metodo: _get_  
Obtener un trabajo de la cola

**Argumentos**:  
- {string} **workerId**: identificador del worker que toma la tarea 

**Retorna**: {Object|null} Objecto con todos los datos del job o null si no hay tareas pendientes en la cola

**Ejemplo**: 

```js
const {Consumer} = require('@dracul/mongoose-queue')
let consumer = new Consumer('test')
let job = await consumer.get('worker')
```

###Metodo: _ack_  
Marca un trabajo como terminado

**Argumentos**:  
- {string} **jobId**: identificador del trabajo

**Retorna**: {Object} Objecto con todos los datos del job

**Ejemplo**: 

```js
const {Consumer} = require('@dracul/mongoose-queue')
let consumer = new Consumer('test')
let job = await consumer.get('worker')
//...Procesar trabajo...
job = await consumer.ack(job.id)
```

###Metodo: _error_  
Marca un trabajo con error

**Argumentos**:  
- {string} **jobId**: identificador del trabajo
- {string} **errorMessage**: mensaje con el error registrado

**Retorna**: {Object} Objecto con todos los datos del job

**Ejemplo**: 

```js
const {Consumer} = require('@dracul/mongoose-queue')
let consumer = new Consumer('test')
let job = await consumer.get('worker')
//...Procesar trabajo...
job = await consumer.error(job.id,"FatalError")
```

## Worker
Permite crear trabajadores que consuman y procesen tareas de la cola

###Metodo: _constructor_
Inicializa una instancia de Worker  
**Argumentos**:  
- {Consumer} **consumer**: Instancia de un consumidor
- {string} **workerId**: Identificador del worker
- {function} **handler**: Funcion para procesar el trabajo
    
**Ejemplo**: 
```js
const {Consumer,Worker} = require('@dracul/mongoose-queue')
let consumer = new Consumer('test')
const handler = (payload)=>{console.log(payload)}
let worker = new Worker(consumer,'worker1',handler)
```

###Metodo: _work_
Obtiene una tarea de la cola y la procesa con la funcion handler

**Argumentos**:  
Sin argumentos
    
**Ejemplo**: 
```js
const {Consumer,Worker} = require('@dracul/mongoose-queue')
let consumer = new Consumer('test')
const handler = (payload)=>{console.log(payload)}
let worker = new Worker(consumer,'worker1',handler)
worker.work()
```


###Metodo: _run_
Ejecuta el worker como daemon. El worker ejecutara el metodo "work" continuamente con un intervalo de tiempo

**Argumentos**:  
- {number} waitTime: Tiempo de espera en milisengundos (ms) entre ejecución de trabajos
    
**Ejemplo**: 
```js
const {Consumer,Worker} = require('@dracul/mongoose-queue')
let consumer = new Consumer('test')
const handler = (payload)=>{console.log(payload)}
let worker = new Worker(consumer,'worker1',handler)
worker.run(10000)
```


###Metodo: _stop_
Detiene el daemon del worker

**Argumentos**:  
sin argumentos
   
**Ejemplo**: 
```js
const {Consumer,Worker} = require('@dracul/mongoose-queue')
let consumer = new Consumer('test')
const handler = (payload)=>{console.log(payload)}
let worker = new Worker(consumer,'worker1',handler)
worker.run(10000)
//...
worker.stop()
```


###Metodo: _on_
El worker permite suscribirse a un EventEmitter con los siguientes eventos


**Eventos**:  
- **workStart**: El worker inicia un trabajo
- **workGet**: El worker obtiene un trabajo de la cola
- **workAck**: El worker da un trabajo por terminado
- **workError**: El worker registra un error en un trabajo
    
**Ejemplo**: 
```js
const {Consumer,Worker} = require('@dracul/mongoose-queue')
let consumer = new Consumer('test')
const handler = (payload)=>{console.log(payload)}
let worker = new Worker(consumer,'worker1',handler)

worker.on('workStart',()=>{
console.log("El worker inicia un trabajo")
})

worker.on('workGet',(job)=>{
console.log("El worker toma un trabajo", job)
})

worker.on('workAck',(job)=>{
console.log("El worker da un trabajo por terminado", job)
})

worker.on('workError',(job, error)=>{
console.log("El worker registra un error en un trabajo", job,  error)
})

worker.run(10000)
```
