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

## Querys & Mutations GraphQl

#### Customization
Get the logo, colors and language.
```js
customization: Customization
```

#### CustomizationCreate
Create customizable settings.
```js
customizationCreate (input: CustomizationInput): Customization
```

#### CustomizationUpdate
Update customizable settings.
```js
customizationUpdate(id: ID!, input: CustomizationInput): Customization
```

#### ColorsUpdate
Updates the selected color.
```js
colorsUpdate(input: ColorInput): Colors
```

#### LogoUpdate
Update the selected logo
```js
logoUpdate(input: LogoInput): Logo
```

#### LogoUpload
Upload the selected logo
```js
logoUpload(file: Upload!): LogoFile!
```

#### LangUpdate
Update the selected language
```js
langUpdate(input: LangInput): Lang
```


## Types & Input GraphQl
_Those fields that contain **!**, are required._
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

## Recommendation

It is recommended to use Scaffold, where you already have all the modules implemented to be able to use it as a project base.
https://github.com/draculjs/scaffold


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[stars-shield]: https://img.shields.io/github/stars/draculjs/modular-framework.svg?style=flat-square
[stars-url]: https://github.com/draculjs/modular-framework/stargazers
[contributors-shield]: https://img.shields.io/github/contributors/draculjs/modular-framework.svg?style=flat-square
[contributors-url]: https://github.com/draculjs/modular-framework/graphs/contributors