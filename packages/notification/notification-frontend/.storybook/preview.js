import { addDecorator } from '@storybook/vue';
import Vue from 'vue'
import vuetify from "../src/plugins/vuetify";
import VueRouter from 'vue-router'
import i18n from '../src/i18n'

let router = new VueRouter({mode: "history", routes: []})

Vue.use(VueRouter)

addDecorator(() => ({
  vuetify,
  i18n,
  router,
  template: '<v-app><v-main><story/></v-main></v-app>',
}));

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
}

//Gql Mock
import mockGqlClient from '../gqlc-mock/gqlc-mock'

//MOCK GQLC PROVIDERS
import notificationProvider from '../src/providers/notificationProvider'

notificationProvider.setGqlc(mockGqlClient)
notificationProvider.setGqlcWs(mockGqlClient)