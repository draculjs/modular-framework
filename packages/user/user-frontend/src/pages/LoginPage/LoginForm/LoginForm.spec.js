//Test basic
import {mount} from '@vue/test-utils'
import { createLocalVue } from '@vue/test-utils'
export const localVue = createLocalVue()

//Test Promises
import flushPromises from 'flush-promises'

//Vue Resources
import i18n from "../../../i18n"
import vuetify from "../../../plugins/vuetify-manual"
import router from "../../../router"
import store from "../../../store"

//Component to Test
import LoginForm from "./LoginForm"

//GraphQl Client Mock
import {createMockClient} from 'mock-apollo-client';
import authProvider from "../../../providers/AuthProvider";
import badCredentialsResolve from "../../../../gqlc-mock/resolves/auth-badCredentials";
import successfulResolve from "../../../../gqlc-mock/resolves/auth-successful";


describe('LoginForm.vue', () => {


    beforeEach(() => {
        const mockGqlClient = createMockClient();
        authProvider.setGqlc(mockGqlClient)
    });

    it('Render Bad Credentials on login fail',  async ()=> {

        authProvider.gqlc.setRequestHandler(
            require('../../../providers/gql/auth.graphql'),
            () => Promise.resolve(badCredentialsResolve)
        );

        const wrapper = mount(LoginForm, {
            vuetify,
            localVue,
            store,
            i18n,
            router
        })

        wrapper.findComponent({ref: 'loginBtn'}).trigger('click')
        await flushPromises()
        expect(wrapper.text()).toMatch('Bad credentials')

    })


    it('Render Network Error on server fault', async () => {

        authProvider.gqlc.setRequestHandler(
            require('../../../providers/gql/auth.graphql'),
            () => Promise.reject(new Error('GraphQL Network Error'))
        );

        const wrapper = mount(LoginForm, {
            vuetify,
            localVue,
            store,
            i18n,
            router
        })

        let button = wrapper.findComponent({ref: 'loginBtn'})
        button.trigger('click')
        await flushPromises()
        expect(wrapper.text()).toMatch('Network error. The server does not respond.')
    })


    it('Login successful as root', async () => {

        authProvider.gqlc.setRequestHandler(
            require('../../../providers/gql/auth.graphql'),
            () => Promise.resolve(successfulResolve)
        );

        const wrapper = mount(LoginForm, {
            vuetify,
            localVue,
            store,
            i18n,
            router
        })

        let button = wrapper.findComponent({ref: 'loginBtn'})
        button.trigger('click')
        await flushPromises()
        expect(wrapper.vm.me.username).toBe('root')
    })


})
