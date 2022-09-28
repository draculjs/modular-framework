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
        getSettingValue: (state) => (key) => {
            if (key) {
                let item = state.settings.find(s => s.key === key)
                if (item) {
                    return item.value
                }
            }
            return null
        },
        isSettingsReady(state) {
            return state.settingsReady
        }
    },
    actions: {
        loadSettings({commit}) {
            return new Promise((resolve, reject) => {
                SettingsProvider.fetchSettings()
                    .then(r => {
                        commit('setSettings', r.data.settingsFetch)
                        commit('setSettingsReady')
                        resolve(r.data.settingsFetch)
                    })
                    .catch(e => reject(e))
            })
        },
        updateSettingValueByKey({commit},{key, value}) {
            return new Promise((resolve, reject) => {
                SettingsProvider.settingValueUpdateByKey(key, value)
                    .then(r => {
                        commit('setSetting', {key, value})
                        resolve(r.data.settingValueUpdateByKey)
                    })
                    .catch(e => reject(e))
            })
        }
    },
    mutations: {
        setSettings(state, val) {
            state.settings = val
        },
        setSetting(state, {key,value}) {
            let item = state.settings.find(s => s.key === key)
            if (item) {
                item.value = value
            }
        },
        setSettingsReady(state) {
            state.settingsReady = true
        },

    }
}
