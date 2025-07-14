import Vue from 'vue'
import vuetify from './plugins/vuetify'
import App from './App.vue'
import { store } from './store'
import i18n from './i18n'
import router from "./router"


import { setGraphQlClientToProviders } from '@dracul/user-frontend'
import * as mediaFrontend from '@dracul/media-frontend'
import * as customizeFrontend from '@dracul/customize-frontend'

Vue.config.productionTip = false

// Montar la app inmediatamente
const app = new Vue({
  store,
  i18n,
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')


async function initializeApp() {
  try {
    const apolloModule = await import('./apollo/index.js')
    const apolloClient = apolloModule.default
    
    // Configurar módulos con builds precompilados
    setGraphQlClientToProviders(apolloClient)
    mediaFrontend.UploadProvider.setGqlc(apolloClient)
    customizeFrontend.customizationProvider.setGqlc(apolloClient)
    

    // 4. Guardar instancia Vuetify
    store.commit('setVuetifyInstance', vuetify)

    // 5. Iniciar autenticación
    await store.dispatch('auth/initAuthentication')
    
    // 6. Cargar datos esenciales en paralelo
    await Promise.allSettled([
      store.dispatch('loadCustomizations'),
      store.dispatch('loadSettings')
    ])
    
    // 7. Actualizar idioma si está disponible
    if (store.state.customization?.language) {
      i18n.locale = store.state.customization.language
    }

  } catch (error) {
    console.error('Error crítico en inicialización:', error)
    store.commit('setGlobalError', error.message)
    
    // Intento de recuperación después de 5 segundos
    setTimeout(() => {
      console.warn('Reintentando inicialización...')
      initializeApp()
    }, 5000)
    return
  } finally {
    // 8. Marcar app como lista
    store.commit('setAppReady', true)
  }
}

initializeApp()