import { addDecorator } from '@storybook/vue';
import vuetify from "../src/plugins/vuetify";
import i18n from '../src/i18n/messages'

addDecorator(() => ({
  vuetify,
  i18n,
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