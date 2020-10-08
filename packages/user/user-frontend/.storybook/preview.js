import { addDecorator } from '@storybook/vue';
import vuetify from "../src/plugins/vuetify-manual";


addDecorator(() => ({
    vuetify,
    template: '<v-app><v-content><story/></v-content></v-app>',
}));

//Gql Mock
import mockGqlClient from '../gqlc-mock/gqlc-mock-data'

//MOCK GQLC PROVIDERS
import authProvider from '../src/providers/AuthProvider'
import groupProvider from '../src/providers/GroupProvider'
import userProvider from '../src/providers/UserProvider'
import roleProvider from '../src/providers/RoleProvider'
import sessionProvider from '../src/providers/SessionProvider'
import recoveryProvider from '../src/providers/RecoveryProvider'

authProvider.setGqlc(mockGqlClient)
groupProvider.setGqlc(mockGqlClient)
userProvider.setGqlc(mockGqlClient)
roleProvider.setGqlc(mockGqlClient)
sessionProvider.setGqlc(mockGqlClient)
recoveryProvider.setGqlc(mockGqlClient)

