//Test basic
import {mount} from '@vue/test-utils'
import { createLocalVue } from '@vue/test-utils'
export const localVue = createLocalVue()

//Test Promises
import flushPromises from 'flush-promises'

//Vue Resources
import i18n from "../../../../i18n"
import vuetify from "../../../../plugins/vuetify-manual"
import router from "../../../../router"
import store from "../../../../store"

//Component to Test
import ServerStatusPage from "./ServerStatusPage"

//GraphQl Client Mock
import {createMockClient} from 'mock-apollo-client';
import BaseProvider from "../../providers/BaseProvider";


describe('ServerStatusPage', () => {


    beforeEach(() => {
        const mockGqlClient = createMockClient();
        BaseProvider.setGqlc(mockGqlClient)
    });

    it('Render Bad Credentials on login fail',  async ()=> {

        BaseProvider.gqlc.setRequestHandler(
            require('../../providers/gql/ping.graphql'),
            () => Promise.resolve({data: {ping: {status: true}}})
        );

        const wrapper = mount(ServerStatusPage, {
            vuetify,
            localVue,
            store,
            i18n,
            router
        })

        await flushPromises()
        expect(wrapper.text()).toMatch('Status:  true')

    })
    }
 )