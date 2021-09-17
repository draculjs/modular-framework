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

**Data returned by the service**
Return an array of queuStats type. This type contains:
Name  | Data Type | Description |
------- | -------------| --------------|
topic   | String       | Worker Topic in process|
added   | Int          | Quantity jobs added|
gotten  | Int          | Quantity jobs gotten |
failed  | Int          | Quantity jobs failed |
done    | Int          | Quantity jobs done |

---
- queues: return an array of workers with their data 

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
Return an array of Queue type. This type contains:
Name  | Data Type | Description |
------- | -------------| --------------|
blockedUntil  | String | Date delay to execute
workerHostname  | String| worker Host Name of worker in process|
workerId | String    | Unique Identifier of worker |
retries | Int    | quantity retries to execute |
topic | String    | job's Topic|
payload | String    | job Content|
done | Boolean    | 'true' if job is succeced else job failed |
icon | String    | job icon  |
error | String    | description of error |
---

## Recommendation
It is recommended to use Scaffold, where you already have all the modules implemented to be able to use it as a project base.
https://github.com/draculjs/scaffold
GitHubGitHub
draculjs/scaffold
Base project with SPA frontend and API backend with Grahql. - draculjs/scaffold. - draculjs/scaffold


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[stars-shield]: https://img.shields.io/github/stars/draculjs/modular-framework.svg?style=flat-square
[stars-url]: https://github.com/draculjs/modular-framework/stargazers
[contributors-shield]: https://img.shields.io/github/contributors/draculjs/modular-framework.svg?style=flat-square
[contributors-url]: https://github.com/draculjs/modular-framework/graphs/contributors


