import SettingsProvider from "../providers/SettingsProvider";

export default {
    state: {
        settings: []
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
    },
    actions: {
        loadSettings({commit}){
            SettingsProvider.fetchSettings().then(r => {
                commit('setSettings',r.data.settingsFetch)
            })
        }
    },
    mutations: {
        setSettings(state, val) {
            state.settings = val
        },


    }
}
