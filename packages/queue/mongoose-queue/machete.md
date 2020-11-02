
## Objetivos:
Sistema de colas pequeño y simple

- Poder manejar diferentes tipos de tareas (topics)
- Poder agregar tareas de diferentes topicos
- Poder definir un tiempo de retraso para el consumo de las tareas
- Consumir tareas y dar un acknoledge una vez procesada
- Poder levantar multiples consumidores para 1 topico
- Tener estadisticas del sistema de queue

## Queue
El sistema propone con 1 sola queue con diferentes topicos   

## Topic
El sistema ofrece separacion por topicos para diferentes tipos de jobs

## Job Payload
Información provista para la ejecución del job

## Producer Manager
Expone una API para ingresar Jobs a la Queue

## Worker Manager
Expone una API para registrar job handlers dinamicamente

## JobHandlerPromise
Funcion que espera los parametros del Job y retorna una Promesa que se encarga de procesar el Job. 
Resuelve **true** en caso de exito.
 
