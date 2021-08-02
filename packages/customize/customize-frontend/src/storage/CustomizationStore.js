import CustomizationProvider from "../providers/CustomizationProvider";

const customizationStore = {
    state: {
        vuetifyInstance: null,
        colors: {
            primary: '#3F51B5',
            onPrimary: '#FFFFFF',
            secondary: '#1565C0',
            onSecondary: '#FFFFFF'
        },
        logo: {
            mode: 'OnlyTitle',
            title: 'APP',
            url: ''
        },
        language: 'en'
    },
    getters: {
        getLogo: state => {
            return state.logo
        },
        getColors: state => {
            return state.colors
        },
        getLanguage: state => {
            return state.language
        }
    },
    actions: {
        loadCustomizations({commit}) {
            return new Promise((resolve, reject) => {

                CustomizationProvider.customization()
                    .then(r => {
                        commit('setColors', r.data.customization.colors)
                        commit('setLogo', r.data.customization.logo)
                        commit('setLanguage', r.data.customization.language)
                        resolve(r.data.customization)
                    })
                    .catch(e => reject(e))

            })
        },
        setLogo({commit}, logo) {
            commit('setLogo', logo)
        },
        setColors({commit}, colors) {
            commit('setColors', colors)
        },
        setLanguage({commit}, language) {
            commit({commit}, language)
        }
    },
    mutations: {
        setVuetifyInstance(state, vuetifyInstance) {
            state.vuetifyInstance = vuetifyInstance
        },
        setLogo(state, {mode, title, url}) {
            state.logo.mode = mode
            state.logo.title = title
            state.logo.url = url
        },
        setColors(state, {primary, onPrimary, secondary, onSecondary}) {
            state.colors.primary = primary
            state.colors.onPrimary = onPrimary
            state.colors.secondary = secondary
            state.colors.onSecondary = onSecondary

            if (state.vuetifyInstance) {
                state.vuetifyInstance.framework.theme.themes.light.primary = primary
                state.vuetifyInstance.framework.theme.themes.light.onPrimary = onPrimary
                state.vuetifyInstance.framework.theme.themes.light.secondary = secondary
                state.vuetifyInstance.framework.theme.themes.light.onSecondary = onSecondary

                state.vuetifyInstance.framework.theme.themes.dark.primary = primary
                state.vuetifyInstance.framework.theme.themes.dark.onPrimary = onPrimary
                state.vuetifyInstance.framework.theme.themes.dark.secondary = secondary
                state.vuetifyInstance.framework.theme.themes.dark.onSecondary = onSecondary
            }

        },
        setLanguage(state, language) {
            state.language = language
        }
    }
}

export default customizationStore
