import AuthProvider from '../providers/AuthProvider'
import jwt_decode from 'jwt-decode'
import ClientError from '../errors/ClientError'

export default {
    state: {
        access_token: null,
        me: null,
        avatarurl: null,
    },
    getters: {
        me: (state) => {
            return state.me
        },
        getAvatarUrl: (state) => {
            if (state.avatarurl) {
                return state.avatarurl
            } else if (state.me && state.me.avatarurl) {
                return state.me.avatarurl
            }
            return null
        },
        getToken: (state) => {
            return state.access_token
        },
        isAuth: (state) => {
            return (state.access_token) ? true : false
        },
        hasRole: (state) => (role) => {
            if (!state.me || !state.me.role) return false
            return state.me.role.name == role
        },
        hasPermission: (state) => (permission) => {
            if (!state.me) return false
            return state.me.role.permissions.includes(permission)
        },
    },
    actions: {
        fetchMe({commit}) {

            return new Promise((resolve, reject) => {
                AuthProvider.me()
                    .then((response) => {
                        let me = response.data.me
                        commit('setMe', me)
                        resolve(me)
                    }).catch((err) => {
                    console.error(err)
                })
            })
        },

        login({commit, dispatch}, {username, password}) {

            return new Promise((resolve, reject) => {
                AuthProvider.auth(username, password)
                    .then((response) => {
                        commit('setAccessToken', response.data.auth.token)
                        dispatch('fetchMe')
                            .then(me => {
                                resolve(me)
                            })
                    }).catch((err) => {

                    let error = new ClientError(err)

                    if (error.code === 'UNAUTHENTICATED' && error.errorMessage === 'BadCredentials') {
                        reject('auth.badCredentials')
                    }

                    reject(error.i18nMessage)

                })
            })
        },


        logout({commit}) {
            commit('avatarUpdate', null)
            commit('setMe', null)
            commit('setAccessToken', null)
        },

        verifyToken({commit, dispatch}, token) {
            try {
                let payload = jwt_decode(token)

                if (payload.exp) {
                    let dateNow = new Date();
                    let dateToken = new Date(payload.exp * 1000)
                    if (dateNow < dateToken) {
                        commit('setAccessToken', token)
                        dispatch('fetchMe')
                        return true
                    } else {
                        return false
                    }
                }

            } catch (e) {
                return false
            }

            return false
        },

        checkAuth: ({state, dispatch}) => {
            if (state.access_token) {
                let payload = jwt_decode(state.access_token)
                if (payload.exp) {
                    let dateNow = new Date();
                    let dateToken = new Date(payload.exp * 1000)
                    if (dateNow > dateToken) {
                        dispatch('logout')
                    } else if (state.me === null) {
                        dispatch('fetchMe')
                    }
                }
            }

        },


    },
    mutations: {
        setAccessToken(state, access_token) {
            state.access_token = access_token
        },
        setMe(state, me) {
            state.me = me
        },
        avatarUpdate(state, avatarurl) {
            state.avatarurl = avatarurl
            state.me.avatarurl = avatarurl
        }
    }
}
