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
                    switch (item.type){
                        case 'stringList':
                        case 'enumList':
                            return item.valueList
                        case 'numberList':
                            return item.valueList.map(v => parseFloat(v))
                        case 'number':
                            return parseFloat(item.value)
                        case 'boolean':
                            return item.value === 'enable'
                        default:
                            return item.value
                    }
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
        updateSettingValueByKey({commit},{key, value, valueList=[]}) {
            return new Promise((resolve, reject) => {
                SettingsProvider.settingValueUpdateByKey(key, value, valueList)
                    .then(r => {
                        commit('setSetting', {key, value, valueList})
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
        setSetting(state, {key, value, valueList}) {
            let item = state.settings.find(s => s.key === key)
            if (item) {
                item.value = value
                item.valueList = valueList
            }
        },
        setSettingsReady(state) {
            state.settingsReady = true
        },

    }
}
