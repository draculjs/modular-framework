import Vue from 'vue'
import Vuex from 'vuex'
import {UserModuleStore} from '@dracul/user-frontend'
import {customizationProvider, CustomizationStore} from '@dracul/customize-frontend'
import {SettingsModuleStore, SettingsProvider} from '@dracul/settings-frontend'
import BaseModuleStore from '../modules/base/storage/BaseModuleStore.js'

Vue.use(Vuex)

import createPersistedState from "vuex-persistedstate";

export const store = new Vuex.Store({
    modules:{
        user: UserModuleStore,
        base: BaseModuleStore,
        customization: CustomizationStore,
        settings: SettingsModuleStore
    },
    plugins: [
        createPersistedState({
            key: 'ajsdjkasd',
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
    ],
  mutations: {
    setAppReady(state, ready) {
      state.appReady = ready
    },
    setGlobalError(state, error) {
      state.globalError = error
    },
    setVuetifyInstance(state, instance) {
      state.vuetify = instance
    },
    setCustomization(state, customization) {
      state.customization = customization
    },
    setSettings(state, settings) {
      state.settings = settings
    }
  },
  actions:{
    async loadCustomizations({ commit }) {
      try {
        const customization = await customizationProvider.getCustomization()
        commit('setCustomization', customization)
      } catch (error) {
        console.error('Error loading customizations:', error)
      }
    },
    async loadSettings({ commit }) {
      try {
        const settings = await SettingsProvider.fetchSettings()
        commit('setSettings', settings)
      } catch (error) {
        console.error('Error loading settings:', error)
      }
    },
  }
})
