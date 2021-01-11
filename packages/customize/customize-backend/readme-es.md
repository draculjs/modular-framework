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

## Querys & Mutations GraphQl

#### Customization
Obtiene el logo, colores y idioma.
```js
customization: Customization
```

#### CustomizationCreate
Crea la configuracion personalisable.
```js
customizationCreate (input: CustomizationInput): Customization
```

#### CustomizationUpdate
Actualiza la configuracion personalizable, Por ejemplo:
```js
customizationUpdate(id: ID!, input: CustomizationInput): Customization
```

#### ColorsUpdate
Actualiza el color seleccionado.
```js
colorsUpdate(input: ColorInput): Colors
```

#### LogoUpdate
Actualiza el logo seleccionado
```js
logoUpdate(input: LogoInput): Logo
```

#### LogoUpload
Sube el logo seleccionado
```js
logoUpload(file: Upload!): LogoFile!
```

#### LangUpdate
Actualiza el idioma seleccionado
```js
langUpdate(input: LangInput): Lang
```


## Types & Input GraphQl
_Aquellos campos que contengan **!**, son obligatorios._
#### Type Customization
```js
type Customization{
    colors: Colors!
    logo: Logo!
    language: String!
}
```

#### Type Colors
```js
type Colors{
    primary: String!
    onPrimary: String!
    secondary: String!
    onSecondary: String!
}
```

#### Type Logo
```js
type Logo{
    mode: String!
    title: String
    filename: String
    url: String
}
```

#### Type Lang
```js
type Lang {
    language: String!
}
```

#### Input CustomizationInput
```js
input CustomizationInput{
    primary: String!
    onPrimary: String!
    secondary: String!
    onSecondary: String!
    logo: String!
    language: String!
}
```

#### Input ColorInput
```js
input ColorInput{
    primary: String!
    onPrimary: String!
    secondary: String!
    onSecondary: String!
}
```

#### Input LogoInput
```js
input LogoInput{
    mode: String!
    title: String
}
```

#### Type LogoFile
```js
type LogoFile {
    filename: String!
    mimetype: String!
    encoding: String!
    url: String!
}
```

#### input LangInput
```js
input LangInput{
    language: String!
}
```

## Recomendación

Se recomienda utilizar Scaffold, donde ya contiene todos los módulos implementados para poder usarlo como base de proyecto.
https://github.com/draculjs/scaffold



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[stars-shield]: https://img.shields.io/github/stars/draculjs/modular-framework.svg?style=flat-square
[stars-url]: https://github.com/draculjs/modular-framework/stargazers
[contributors-shield]: https://img.shields.io/github/contributors/draculjs/modular-framework.svg?style=flat-square
[contributors-url]: https://github.com/draculjs/modular-framework/graphs/contributors
