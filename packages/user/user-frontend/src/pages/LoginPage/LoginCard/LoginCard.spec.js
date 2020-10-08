import {mount} from '@vue/test-utils'
import { createLocalVue } from '@vue/test-utils'
export const localVue = createLocalVue()

//Resources
import i18n from "../../../i18n"
import vuetify from "../../../plugins/vuetify-manual"
import router from "../../../router"
import store from "../../../store"


//Component to Test
import LoginCard from "./LoginCard"


describe('LoginCard.vue', () => {



    it('Render Sign in',  async ()=> {

        const wrapper = mount(LoginCard, {
            vuetify,
            localVue,
            store,
            i18n,
            router
        })

        expect(wrapper.text()).toMatch('Sign in')

    })
})