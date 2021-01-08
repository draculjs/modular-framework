[![Contributors][contributors-shield]][contributors-url]
[![Stargazers][stars-shield]][stars-url]
# Dracul Customize Module

The Customizable Module allows you in a simple and easy way to personalize your page.
![Preview frontend Dracul Module Customize](https://i.imgur.com/oG06ozZ.png "Preview frontend Dracul Module Customize")

## This module allows:

- Selection of the platform language
- Configuration of the platform colors
- Customization of the logo and title of the platform
- Permissions to carry out said operations

## Installation

```
npm i @dracul/customize-backend
```

## Usage example

_Simply merge the **Resolvers & Types** ._

```js
import {types as customTypes,resolvers as customResolvers} from '@dracul/customize-backend'
```

_You simply have to merge the ** Configurations and Permissions ** at the beginning of the project.._

```js
import {initCustomization, initPermissionsCustomization} from '@dracul/customize-backend'
```
_All the rest of the functionality is done through the frontend._




<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[stars-shield]: https://img.shields.io/github/stars/draculjs/modular-framework.svg?style=flat-square
[stars-url]: https://github.com/draculjs/modular-framework/stargazers
[contributors-shield]: https://img.shields.io/github/contributors/draculjs/modular-framework.svg?style=flat-square
[contributors-url]: https://github.com/draculjs/modular-framework/graphs/contributors
