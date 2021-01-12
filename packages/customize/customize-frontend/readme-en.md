[![Contributors][contributors-shield]][contributors-url]
[![Stargazers][stars-shield]][stars-url]
# Dracul Customize Module
​
This module contains components that allow you to modify the colors, logo, select language and title of the platform from a panel.
![Dracul Module Customize](https://i.imgur.com/oG06ozZ.png "Dracul Module Customize")
​
## This module contains the following page and components:

- Page where it contains all the configuration to customize the platform.
- Language selection component.
- Color Editing Component (Primary and Secondary Color).
- Component to select the logo in the bar from the menu.
- Component of visualization of the preview of the logo + title.
- Component for displaying the preview of the selected colors.
​
## Requeriments
- Graphql (Apollo Server)
- Vuex
- Vuetify (i18n)
- Vue Router
​
## Installation:
​
```
npm i @dracul/customize-frontend
```
​
## Usage example:
​
_To use Provider with services **Graphql** ._

```js
import { customizationProvider } from "@dracul/customize-frontend";

customizationProvider.setGqlc(apolloClient);
```

_To get **Route** of customize ._

```js
import {routes as customRoutes} from '@dracul/customize-frontend'
```

_Get i18n ** translations **._

```js
import {i18nMessages as i18nMessagesCustom} from '@dracul/customize-frontend'
```
_It is added to the Store with **Vuex** ._

```
import Vue from 'vue'
import Vuex from 'vuex'
import {CustomizationStore} from '@dracul/customize-frontend'
Vue.use(Vuex)

import createPersistedState from "vuex-persistedstate";

export default new Vuex.Store({
    modules:{
        customization: CustomizationStore,
    },
    plugins: [
        createPersistedState({
            key: process.env.VUE_APP_KEY,
            paths: ['user'],
            reducer: state => (
                {,
                    customization: {
                        colors: state.customization.colors,
                        logo: state.customization.logo,
                        language: state.customization.language
                    },
                })
        })
    ]
})
```
_An example of using the ** LogoToolbar & TitleTolbar ** components to be displayed._
![.Tittle Dracul Customize](https://i.imgur.com/l2cbQyb.png ".Tittle Dracul Customize")
```
<template>
        <v-app>
            <layout>
                <template>
                    <logo-toolbar></logo-toolbar>
                    <title-toolbar></title-toolbar>
                </template>
            </layout>
        </v-app>
</template>

<script>
        import {LogoToolbar,TitleToolbar} from '@dracul/customize-frontend'

        export default {
            name: 'App',
            components: {LogoToolbar,TitleToolbar},
          };
</script>
```
​
## Sample images

![Dracul Module Customize](https://i.imgur.com/XZST1xB.png "Dracul Module Customize")
_(Img1: Options menu that contains 3 buttons to choose the corresponding option.)_
​
![Dracul Module Customize](https://i.imgur.com/oG06ozZ.png "Dracul Module Customize")
_(Img2: Language selection component where it contains a select and apply button.)_
​
![Dracul Module Customize](https://i.imgur.com/VWBQu3G.png "Dracul Module Customize")
_(Img3: Color selection component, where you choose primary, secondary color and apply button, it also contains a preview of the selected colors.)_
​
![Dracul Module Customize](https://i.imgur.com/F7ODrmk.png "Dracul Module Customize")
_(Img4: Component for title editing, image mode and logo upload, it also contains a preview of it and apply button.)_
​
![Dracul Module Customize](https://i.imgur.com/TUB5wXi.png "Dracul Module Customize")
_(Img5: Preloaded logo and title preview component.)_
​
## Direction to access

You can access the customization panel, for example http://localhost:8080/customization
​
## Recommendation

It is recommended to use Scaffold, where you already have all the modules implemented to be able to use it as a project base.
https://github.com/draculjs/scaffold
​
<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
​
[stars-shield]: https://img.shields.io/github/stars/draculjs/modular-framework.svg?style=flat-square
[stars-url]: https://github.com/draculjs/modular-framework/stargazers
[contributors-shield]: https://img.shields.io/github/contributors/draculjs/modular-framework.svg?style=flat-square
[contributors-url]: https://github.com/draculjs/modular-framework/graphs/contributors