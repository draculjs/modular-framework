import Vue from 'vue'
import Vuex from 'vuex'

import createPersistedState from "vuex-persistedstate"
import {UserModuleStore} from '@dracul/user-frontend'
import {CustomizationStore} from '@dracul/customize-frontend'
import BaseModuleStore from './BaseModuleStore'

Vue.use(Vuex)

export default new Vuex.Store({
    modules:{
        user: UserModuleStore,
        base: BaseModuleStore,
        customization: CustomizationStore
    },
    plugins: [
        createPersistedState({
            key: process.env.VUE_APP_KEY,
            paths: ['user'],
            reducer: state => (
                {
                    user: {
                        access_token: state.user.access_token,
                        refresh_token: state.user.refresh_token,
                        me: state.user.me,
                        avatarurl: state.user.avatarurl
                    },
                    customization: {
                        colors: state.customization.colors,
                        logo: state.customization.logo,
                        language: state.customization.language
                    },
                })
        })
    ]
})