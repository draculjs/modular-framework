[![Contributors][contributors-shield]][contributors-url]
[![Stargazers][stars-shield]][stars-url]
# Modulo Dracul Queue-frontend

El Modulo Queue-frontend te permite visualizar las estadisticas de cada worker agregado a la cola. Las estadisticas son las tareas agregadas, pendientes, obtenidas y agarradas.

## Requisitos
-Graphql (Apollo Server)

## Este modulo te permite:

- Obtener las estadisticas de los workers en proceso en la cola.

## Instalacion

```
npm i @dracul/queue-frontend
```

## Ejemplo de Uso

_Provider de Servicios Graphql_

```js
import { queueStatsProvider } from "@dracul/queue-frontend";
```

_Traducción i18n_

```js
import {i18nMessages as i18nMessagesQueue} from '@dracul/queue-frontend'
```

_Routes de las estadisticas de la cola_

```js
import {routes} from '@dracul/queue-frontend'
```

## Página de las estadisticas de la cola

Podés acceder las estadisticas de la cola con /queue-stats. For example http://localhost:8080/queue-stats

![Dracul Module Queue-frontend](https://i.imgur.com/xzypisD.png "Dracul Module Queue-frontend")

### Recomendacion
Se aconseja utilizar scaffold dónde tenés todos los módulos ya integrados y link de scafold

https://github.com/draculjs/scaffold


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[stars-shield]: https://img.shields.io/github/stars/draculjs/modular-framework.svg?style=flat-square
[stars-url]: https://github.com/draculjs/modular-framework/stargazers
[contributors-shield]: https://img.shields.io/github/contributors/draculjs/modular-framework.svg?style=flat-square
[contributors-url]: https://github.com/draculjs/modular-framework/graphs/contributors
