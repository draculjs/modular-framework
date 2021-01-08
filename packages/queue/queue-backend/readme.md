[![Contributors][contributors-shield]][contributors-url]
[![Stargazers][stars-shield]][stars-url]
# Dracul Queue-backend Module

The Queue Modules allow you to see workers stats in a queue. The stats are jobs added, jobs done, jobs pending and jobs gotten

## Requeriments
-Graphql (Apollo Server)

## This module allows:

- Get stats of workers in process in a queue.

## Installation

```
npm i @dracul/queue-backend
```

## Usage example

_Types and Resolvers._

```js
import {types,resolvers} from '@dracul/queue-backend'
```

_Permisses to use_

```js
import {QUEUE_SHOW} from "@dracul/queue-backend/lib/permissions"
```

### Querys Grapqhql

- queueStats: return an array of workers with all their jobs in each states in a queue

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

- queues: return an array of workers with their data 

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
