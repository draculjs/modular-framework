import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import store from './store'
import i18n from './i18n'
import router from "./router";

import apolloClient from './apollo'
import {setGraphQlClientToProviders} from '@dracul/user-frontend'
import {customizationProvider} from '@dracul/customize-frontend'
import FileProvider from './modules/media/providers/FileProvider'
import UploadProvider from './modules/media/providers/UploadProvider'
import FileMetricsProvider from './modules/media/providers/FileMetricsProvider'

setGraphQlClientToProviders(apolloClient)
customizationProvider.setGqlc(apolloClient)
UploadProvider.setGqlc(apolloClient)
FileProvider.setGqlc(apolloClient)
FileMetricsProvider.setGqlc(apolloClient)

Vue.config.productionTip = false

//Customization instances inject
//Customization instances inject
store.commit('setVuetifyInstance', vuetify)

//1. Load from localstore
i18n.locale = store.state.customization.language
//2. Load from backend
store.dispatch('loadCustomizations')
    .then(r => {
      i18n.locale = r.language
    })

new Vue({
  vuetify,
  store,
  i18n,
  router,
  render: h => h(App)
}).$mount('#app')
