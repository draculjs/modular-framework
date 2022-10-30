import CustomizationProvider from "../providers/CustomizationProvider";

const customizationStore = {
    state: {
        darkMode: false,
        vuetifyInstance: null,
        lightTheme: {
            primary: '#3F51B5',
            onPrimary: '#FFFFFF',
            secondary: '#1565C0',
            onSecondary: '#FFFFFF',
            background: '#F5F5F5'
        },
        darkTheme: {
            primary: '#3F51B5',
            onPrimary: '#FFFFFF',
            secondary: '#1565C0',
            onSecondary: '#FFFFFF',
            background: '#F5F5F5'
        },
        logo: {
            mode: 'OnlyTitle',
            title: 'APP',
            url: ''
        },
        language: 'en'
    },
    getters: {
        darkMode: (state) => {
            return state.darkMode
        },
        getLogo: state => {
            return state.logo
        },
        getColors: state => {
            return state.lightTheme
        },
        getLigthTheme: state => {
            return state.lightTheme
        },
        getDarkTheme: state => {
            return state.darkTheme
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
                        commit('setColors', r.data.customization)
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
            console.log(colors)
            commit('setColors', colors)
        },
        setLanguage({commit}, language) {
            commit({commit}, language)
        }
    },
    mutations: {
        darkMode(state, val){
            state.darkMode = val
        },
        setVuetifyInstance(state, vuetifyInstance) {
            state.vuetifyInstance = vuetifyInstance
        },
        setLogo(state, {mode, title, url}) {
            state.logo.mode = mode
            state.logo.title = title
            state.logo.url = url
        },
        setColors(state, {lightTheme, darkTheme}) {
            state.lightTheme.primary = lightTheme.primary
            state.lightTheme.onPrimary = lightTheme.onPrimary
            state.lightTheme.secondary = lightTheme.secondary
            state.lightTheme.onSecondary = lightTheme.onSecondary
            state.lightTheme.background = lightTheme.background
            state.lightTheme.appBar = lightTheme.appBar

            state.darkTheme.primary = darkTheme.primary
            state.darkTheme.onPrimary = darkTheme.onPrimary
            state.darkTheme.secondary = darkTheme.secondary
            state.darkTheme.onSecondary = darkTheme.onSecondary
            state.darkTheme.background = darkTheme.background
            state.darkTheme.appBar = darkTheme.appBar

            if (state.vuetifyInstance) {
                state.vuetifyInstance.framework.theme.themes.light.primary = lightTheme.primary
                state.vuetifyInstance.framework.theme.themes.light.onPrimary = lightTheme.onPrimary
                state.vuetifyInstance.framework.theme.themes.light.secondary = lightTheme.secondary
                state.vuetifyInstance.framework.theme.themes.light.onSecondary = lightTheme.onSecondary
                state.vuetifyInstance.framework.theme.themes.light.background = lightTheme.background
                state.vuetifyInstance.framework.theme.themes.light.appBar = lightTheme.appBar

                state.vuetifyInstance.framework.theme.themes.dark.primary = darkTheme.primary
                state.vuetifyInstance.framework.theme.themes.dark.onPrimary = darkTheme.onPrimary
                state.vuetifyInstance.framework.theme.themes.dark.secondary = darkTheme.secondary
                state.vuetifyInstance.framework.theme.themes.dark.onSecondary = darkTheme.onSecondary
                state.vuetifyInstance.framework.theme.themes.dark.background = darkTheme.background
                state.vuetifyInstance.framework.theme.themes.dark.appBar = darkTheme.appBar
            }

        },
        setLanguage(state, language) {
            state.language = language
        }
    }
}

export default customizationStore
