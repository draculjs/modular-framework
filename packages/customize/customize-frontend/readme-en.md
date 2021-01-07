[![Contributors][contributors-shield]][contributors-url]
[![Stargazers][stars-shield]][stars-url]
# Dracul Customize Module
​
This module contains components that allow you to modify the colors, logo, select language and title of the platform from a panel.
​
## This module contains the following page and components:

- Visualization of the logo preview.
- Visualization of the menu toolbar.
- Visualization of the logo in the toolbar.
- Page where it contains all the configuration to customize the platform.

​
## Requeriments
-Graphql (Apollo Server)
-Vuex
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
## Direction to access

You can access the customization panel, for example http://localhost:8080/customization
​
<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
​
[stars-shield]: https://img.shields.io/github/stars/draculjs/modular-framework.svg?style=flat-square
[stars-url]: https://github.com/draculjs/modular-framework/stargazers
[contributors-shield]: https://img.shields.io/github/contributors/draculjs/modular-framework.svg?style=flat-square
[contributors-url]: https://github.com/draculjs/modular-framework/graphs/contributors
