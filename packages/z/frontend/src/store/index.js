import Vue from 'vue'
import Vuex from 'vuex'
import {UserModuleStore} from '@dracul/user-frontend'
import {CustomizationStore} from '@dracul/customize-frontend'
import {SettingsModuleStore} from '@dracul/settings-frontend'
import BaseModuleStore from '../modules/base/storage/BaseModuleStore'

Vue.use(Vuex)

import createPersistedState from "vuex-persistedstate";

export default new Vuex.Store({
    modules:{
        user: UserModuleStore,
        base: BaseModuleStore,
        customization: CustomizationStore,
        settings: SettingsModuleStore
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
                        lightTheme: state.customization.lightTheme,
                        darkTheme: state.customization.darkTheme,
                        logo: state.customization.logo,
                        language: state.customization.language,
                        darkMode: state.customization.darkMode
                    },
                })
        })
    ]
})
