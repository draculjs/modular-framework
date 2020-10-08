import {mount} from '@vue/test-utils'
import { createLocalVue } from '@vue/test-utils'

//We need a instance of i18n, Vuetify, and router
import i18n from "../../i18n"
import vuetify from "../../plugins/vuetify-manual"
import router from "../../router"
import store from "../../store"


export const localVue = createLocalVue()
// localVue.use(i18n)
// localVue.use(router)

//Component to Test. (@ is an alias of <rootdir>/src/)
import Login from "./index"


//Setup Vuex
import Vuex from 'vuex'

localVue.use(Vuex)



describe('LoginPage.vue', () => {

    //Sign in on start

    it('Render Sign in on start', () => {
        const wrapper = mount(Login, {
            vuetify,
            localVue,
            store: store,
            i18n,
            router
        })
        expect(wrapper.text()).toMatch('Sign in')
    })


    // Bad Credentials on login fail

    it('Render Bad Credentials on login fail', async () => {

        let actions = {
            login: jest.fn(function() {

                this.commit('SET_USER_INVALID', true);
                this.commit('SET_GENERAL_ERROR', 'user.badCredentials')
            })
        }

        const wrapper = mount(Login, {
            vuetify,
            localVue,
            store:store,
            i18n,
            router
        })

        let button = wrapper.findComponent({ref: 'loginBtn'})
        button.trigger('click')
        await wrapper.vm.$nextTick()
        expect(wrapper.text()).toMatch('Bad credentials')
    })


    //Network Error on server fault

    it('Render Network Error on server fault', async () => {

        let actions = {
            login: jest.fn(function() {
                this.commit('SET_USER_INVALID', true);
                this.commit('SET_GENERAL_ERROR', 'common.networkError')
            })
        }

        store.actions = actions

        const wrapper = mount(Login, {
            vuetify,
            localVue,
            store: store,
            i18n,
            router
        })

        let button = wrapper.findComponent({ref: 'loginBtn'})
        button.trigger('click')
        await wrapper.vm.$nextTick()
        expect(wrapper.text()).toMatch('Network error. The server does not respond.')
    })


    //Go Home on Login ok

    it('Go Home on Login ok', async () => {

        let actions = {
            login: jest.fn(function() {
                //Set user. This is watch by the component Login for push to home
                this.commit('SET_ME_USER', {username: 'root'});
            })
        }
        store.actions = actions

        const wrapper = mount(Login, {
            vuetify,
            localVue,
            store: store,
            i18n,
            router
        })

        let button = wrapper.findComponent({ref: 'loginBtn'})
        button.trigger('click')
        await wrapper.vm.$nextTick()
        expect(wrapper.vm.$route.name).toBe('home')
    })


})
