[![Contributors][contributors-shield]][contributors-url]
[![Stargazers][stars-shield]][stars-url]
# Dracul modulo personalizable

El Módulo Personalizable le permite de una manera simple y sencilla poder personalizar su pagina.
![Preview frontend Dracul Module Customize](https://i.imgur.com/oG06ozZ.png "Preview frontend Dracul Module Customize")

## Este modulo permite:

- Selección del idioma de la plataforma
- Configuracion de los colores de la plataforma
- Personalización del logo y titulo de la plataforma
- Permisos para realizar dichas operaciones

## Instalación

```
npm i @dracul/customize-backend
```

## Ejemplo de uso

_Simplemente se deben mergear los **Resolvers & Types** ._

```js
import {types as customTypes,resolvers as customResolvers} from '@dracul/customize-backend'
```

_Tambien se debe importar en el inicio del proyecto las **Configuraciones y Permisos** ._

```js
import {initCustomization, initPermissionsCustomization} from '@dracul/customize-backend'
```
_Todo el resto de la funcionalidad se realiza por medio del frontend ._




<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[stars-shield]: https://img.shields.io/github/stars/draculjs/modular-framework.svg?style=flat-square
[stars-url]: https://github.com/draculjs/modular-framework/stargazers
[contributors-shield]: https://img.shields.io/github/contributors/draculjs/modular-framework.svg?style=flat-square
[contributors-url]: https://github.com/draculjs/modular-framework/graphs/contributors
