[![Contributors][contributors-shield]][contributors-url]
[![Stargazers][stars-shield]][stars-url]
# Modulo personalizable dracul
​
Este módulo contiene componentes que le permiten desde un panel modificar, los colores, logo, seleccionar idioma y titulo de la plataforma.
​
## Este módulo contiene la siguiente pagina y componentes:
​
- Visualizacion de la vista previa del logo.
- Visualizacion de la barra de herramientas del menú.
- Visualizacion del logo en la barra de herramientas.
- Pagina donde contiene toda la configuracion para personalizar la plataforma.

​
## Requerimientos
-Graphql (Apollo Server)
-Vuex
​
## Instalación:
​
```
npm i @dracul/customize-frontend
```
​
## Ejemplo de uso:
​
_Para utilizar el proveedor de servicios con  **Graphql** ._

```js
import { customizationProvider } from "@dracul/customize-frontend";

customizationProvider.setGqlc(apolloClient);
```

_Para obtener las **rutas** ._

```js
import {routes as customRoutes} from '@dracul/customize-frontend'
```

_Obtener i18n  **traducciones** ._

```js
import {i18nMessages as i18nMessagesCustom} from '@dracul/customize-frontend'
```
_Se agrega al Store con **Vuex** ._

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
_Un ejemplo de uso de los componentes **LogoToolbar & TitleTolbar**  para que se visualize._
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
## Dirección de Acceso

Puedes acceder al panel de personalizacion, por ejemplo http://localhost:8080/customization
​
<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
​
[stars-shield]: https://img.shields.io/github/stars/draculjs/modular-framework.svg?style=flat-square
[stars-url]: https://github.com/draculjs/modular-framework/stargazers
[contributors-shield]: https://img.shields.io/github/contributors/draculjs/modular-framework.svg?style=flat-square
[contributors-url]: https://github.com/draculjs/modular-framework/graphs/contributors
