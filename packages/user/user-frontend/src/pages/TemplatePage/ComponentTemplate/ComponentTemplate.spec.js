import {mount, createLocalVue} from '@vue/test-utils'

export const localVue = createLocalVue()

//Resources
import i18n from "../../../i18n"
import vuetify from "../../../plugins/vuetify-manual"
import router from "../../../router"
import store from "../../../store"


//Component to Test
import ComponentTemplate from "./ComponentTemplate"

//Provider Request - Graphql Mock
//import flushPromises from 'flush-promises'
//import {createMockClient} from 'mock-apollo-client';
//import someProvider from "../../../providers/SomeProvider";
//import template from "../../../../gqlc-mock/resolves/template";

/*
    someProvider.gqlc.setRequestHandler(
        require('../../../providers/gql/some.graphql'),
        () => Promise.resolve(template)
    );
*/

describe('ComponentTemplate.vue', () => {

    /*
        //Reset GqlClilent on each test
        beforeEach(() => {
            const mockGqlClient = createMockClient();
            authProvider.setGqlc(mockGqlClient)
        });
    */

    it('Render Something',  async ()=> {

        const wrapper = mount(ComponentTemplate, {
            vuetify,
            localVue,
            store,
            i18n,
            router
        })

        let textoComponente = wrapper.text()

        expect(textoComponente).toMatch('Component Template')

    })
})