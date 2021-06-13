import SettingsProvider from "../providers/SettingsProvider";

export default {
    state: {
        settings: [],
        settingsReady: false
    },
    getters: {
        getSetting: (state) => (key) => {
            if (key) {
                let item = state.settings.find(s => s.key === key)
                if (item) {
                    return item
                }
            }
            return null
        },
        isSettingsReady(state){
            return state.settingsReady
        }
    },
    actions: {
        loadSettings({commit}){
            SettingsProvider.fetchSettings().then(r => {
                commit('setSettings',r.data.settingsFetch)
                commit('setSettingsReady')
            })
        }
    },
    mutations: {
        setSettings(state, val) {
            state.settings = val
        },
        setSettingsReady(state) {
            state.settingsReady = true
        },

    }
}
