[![Contributors][contributors-shield]][contributors-url]
[![Stargazers][stars-shield]][stars-url]
# Modulo Dracul Queue-backend 

El Modulo Queue-backend te permite visualizar los workers con sus tareas agregadas, finalizadas, pendientes, tomadas y fallidas. 

## Requerimientos
-Graphql (Apollo Server)

## Este módulo te permite:

- Obtener las estadisticas de cada worker en proceso en la cola.

## Instalación

```
npm i @dracul/queue-backend
```

## Ejemplo de uso

_Types y resolvers._

```js
import {types,resolvers} from '@dracul/queue-backend'
```

_Permisos para usarlo_

```js
import {QUEUE_SHOW} from "@dracul/queue-backend/lib/permissions"
```

### Querys Grapqhql

- queueStats: devuelve un array de workers con los trabajos en cada estado pertenecientes a una cola

```graphql endpoint
queueStats: [QueueStats]

QueueStats{
    topic: String!
    added: Int
    gotten: Int
    failed: Int
    done: Int
}
```

**Datos que retorna el servicio**
Retorna un Array del type QueueStats. Este type contiene:
Nombre  | Tipo de dato | Descripcion |
------- | -------------| --------------|
topic   | String       | Topico del worker que esta en proceso|
added   | Int          | Cantidad de tareas agregadas al worker|
gotten  | Int          | Cantidad de tareas tomadas en el worker |
failed  | Int          | Cantidad de tareas que fallaron en el worker |
done    | Int          | Cantidad de tareas finalizadas en el worker |

---

- queues: devuelve un array de workers con su informacion correspondiente 

```graphql endpoint
queues: [Queue]

type Queue{
    blockedUntil: String
    workerHostname: String
    workerId: String
    retries: Int
    topic: String!
    payload: String
    done: Boolean
    error: String
}
```

**Datos que retorna el servicio**
Retorna un Array del type Queue. Este type contiene:
Nombre  | Tipo de dato | Descripcion |
------- | -------------| --------------|
blockedUntil  | String | Fecha de retraso de ejecución|
workerHostname  | String| Nombre del worker que lo procesa|
workerId | String    | Identificador único del worker |
retries | Int    | cantidad de reintentos de ejecución |
topic | String    | topico de la tarea|
payload | String    | Contenido de la tarea |
done | Boolean    | 'true' si la tarea fue exitosa, caso contrario la tarea falló |
icon | String    | icono de la tarea |
error | String    | descripción del error si ocurre |
---


### Recomendacion
Se aconseja utilizar scaffold dónde tenés todos los módulos ya integrados y link de scafold

https://github.com/draculjs/scaffold


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[stars-shield]: https://img.shields.io/github/stars/draculjs/modular-framework.svg?style=flat-square
[stars-url]: https://github.com/draculjs/modular-framework/stargazers
[contributors-shield]: https://img.shields.io/github/contributors/draculjs/modular-framework.svg?style=flat-square
[contributors-url]: https://github.com/draculjs/modular-framework/graphs/contributors
