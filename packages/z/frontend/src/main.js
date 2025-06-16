import Vue from 'vue'
import vuetify from './plugins/vuetify';
import App from './App.vue'
import store from './store'
import i18n from './i18n'
import router from "./router";

import apolloClient from './apollo'
import {setGraphQlClientToProviders} from '@dracul/user-frontend'
import {customizationProvider} from '@dracul/customize-frontend'
import {notificationProvider} from '@dracul/notification-frontend'
import {SettingsProvider} from '@dracul/settings-frontend'
import { AuditProvider } from '@dracul/audit-frontend';

import {UploadProvider, UserStorageProvider, FileProvider, FileMetricsProvider} from '@dracul/media-frontend'

setGraphQlClientToProviders(apolloClient)
customizationProvider.setGqlc(apolloClient)
notificationProvider.setGqlc(apolloClient)
notificationProvider.setGqlcWs(apolloClient)

SettingsProvider.setGqlc(apolloClient)
//set uploadProvider at SettingsProvider from @dracul/media-frontend
SettingsProvider.setUploadProvider(UploadProvider)

UploadProvider.setGqlc(apolloClient)
UserStorageProvider.setGqlc(apolloClient)
FileProvider.setGqlc(apolloClient)
FileMetricsProvider.setGqlc(apolloClient)
AuditProvider.setGqlc(apolloClient)

Vue.config.productionTip = false

//Customization instances inject
store.commit('setVuetifyInstance', vuetify)

//1. Load from localstore
i18n.locale = store.state.customization.language
//2. Load from backend
store.dispatch('loadCustomizations')
    .then(r => {
        i18n.locale = r.language
    })

store.dispatch('loadSettings')

new Vue({
    store,
    i18n,
    router,
    vuetify,
    render: h => h(App)
}).$mount('#app')
