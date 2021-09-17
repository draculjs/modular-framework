import { addDecorator } from '@storybook/vue';
import vuetify from "../src/plugins/vuetify-manual";
import i18n from '../src/i18n/index'

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
import queueStatsProvider from '../src/providers/QueueStatsProvider'
import QueueProvider from '../src/providers/QueueProvider'


queueStatsProvider.setGqlc(mockGqlClient)
QueueProvider.setGqlc(mockGqlClient)
