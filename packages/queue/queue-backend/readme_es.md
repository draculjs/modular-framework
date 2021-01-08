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

```js
queueStats: [QueueStats]

QueueStats{
    topic: String!
    added: Int
    gotten: Int
    failed: Int
    done: Int
}
```

- queues: devuelve un array de workers con su informacion correspondiente 

```js
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


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[stars-shield]: https://img.shields.io/github/stars/draculjs/modular-framework.svg?style=flat-square
[stars-url]: https://github.com/draculjs/modular-framework/stargazers
[contributors-shield]: https://img.shields.io/github/contributors/draculjs/modular-framework.svg?style=flat-square
[contributors-url]: https://github.com/draculjs/modular-framework/graphs/contributors
