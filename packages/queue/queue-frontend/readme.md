[![Contributors][contributors-shield]][contributors-url]
[![Stargazers][stars-shield]][stars-url]
# Dracul Queue-frontend Module

The Queue-frontend Module allow you to show workers  stats in a queue. The stats are jobs added, jobs done, jobs pending and jobs gotten

## Requeriments
-Graphql (Apollo Server)

## This module allows:

- Get stats of workers in process in a queue.

## Installation

```
npm i @dracul/queue-frontend
```

## Usage example

_To use Provider with services Graphql_

```js
import { queueStatsProvider } from "@dracul/queue-frontend";
```

_Tanslation i18n_

```js
import {i18nMessages} from '@dracul/queue-frontend'
```

_To get Route of stats queue_

```js
import {routes} from '@dracul/queue-frontend'
```


## Page of Queue stats

You can access to stats queue with /queue-stats. For example http://localhost:8080/queue-stats

![Dracul Module Queue-frontend](https://i.imgur.com/xzypisD.png "Dracul Module Queue-frontend")


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

##
