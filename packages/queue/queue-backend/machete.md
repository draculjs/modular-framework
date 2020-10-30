
## Objetivos:
Sistema de colas pequeño y simple

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
 
