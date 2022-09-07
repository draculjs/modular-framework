import AuthProvider from '../providers/AuthProvider'
import jwt_decode from 'jwt-decode'
import ClientError from '../errors/ClientError'

export default {
    state: {
        access_token: null,
        refresh_token: {
            id: null,
            expiryDate: null,
            sessionId: null
        },
        me: null,
        avatarurl: null,
        now: new Date()
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
        getRefreshToken: (state) => {
            return state.refresh_token
        },
        getRole: (state) => {
            return state.me.role.name;
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
        tokenIsExpired: (state) => () => {
            try {

                if (!state.access_token) return true

                let payload = jwt_decode(state.access_token)

                if (!payload.exp) return true

                let dateToken = new Date(payload.exp * 1000)

                let now = new Date()
                if (now > dateToken) return true

                return false

            } catch (err) {
                console.error(err)
                return true
            }

        },
        refreshTokenIsExpired: (state) => () => {

            if (!state.refresh_token || !state.refresh_token.expiryDate) {
                return true
            }

            let expiryDate = new Date(parseInt(state.refresh_token.expiryDate))

            let now = new Date()
            if (now > expiryDate) {
                return true
            }

            return false

        }
    },
    actions: {
        fetchMe({commit}) {

            return new Promise((resolve, reject) => {
                AuthProvider.me()
                    .then((response) => {
                        let me = response.data.me
                        commit('setMe', me)
                        resolve(me)
                    })
                    .catch((err) => {
                        reject(err)
                    })
            })
        },

        login({commit, dispatch}, {username, password, useLDAP}) {

            return new Promise((resolve, reject) => {

                function errorHandler(err) {
                    let error = new ClientError(err)

                    if (error.code === 'UNAUTHENTICATED' && error.errorMessage === 'BadCredentials') {
                        return reject('auth.badCredentials')
                    }

                    return reject(error.i18nMessage)
                }

                

                AuthProvider.auth(username, password, useLDAP)
                    .then((response) => {
                        console.log(response.data.auth)
                        commit('setAccessToken', response.data.auth.token)
                        commit('setRefreshToken', response.data.auth.refreshToken)
                        dispatch('fetchMe')
                            .then(me => {
                                resolve(me)
                            })
                            .catch(err => {
                                dispatch('logout')
                                errorHandler(err)
                            })
                    }).catch((err) => {
                    errorHandler(err)
                })
            })
        },


        logout({commit}) {
            commit('avatarUpdate', null)
            commit('setMe', null)
            commit('setAccessToken', null)
            commit('setRefreshToken', {id: null, expiryDate: null, sessionId: null})
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

        checkAuth: ({state, dispatch, getters}) => {
            if (getters.refreshTokenIsExpired() === true) {
                dispatch('logout')
            } else if (state.me === null) {
                dispatch('fetchMe')
            }
        },

        validateSession: ({dispatch, getters, commit}) => {
            return new Promise((resolve) => {
                if (getters.tokenIsExpired() === true) {

                    if (getters.refreshTokenIsExpired() === false) {
                        //Puedo Renovar
                        dispatch('renewToken')
                            .then(token => {
                                commit('setAccessToken', token)
                                resolve(true)
                            })
                            .catch(e => {
                                console.error("Error on renewToken", e)
                                dispatch('logout')
                            })
                    } else {
                        dispatch('logout')
                        resolve(false)
                    }


                } else {
                    resolve(true)
                }


            })
        },

        renewToken: ({getters}) => {
            return new Promise((resolve, reject) => {
                AuthProvider.refreshToken(getters.getRefreshToken.id)
                    .then(r => {
                        let token = r.data.refreshToken.token
                        resolve(token)
                    })
                    .catch(e => {
                        console.error("RENOVADO token", e)
                        reject(e)
                    }).finally(() => {
                })
            })

        }

    },

    mutations: {
        setAccessToken(state, access_token) {
            state.access_token = access_token
        },
        setRefreshToken(state, refresh_token) {
            state.refresh_token = refresh_token
        },
        setMe(state, me) {
            state.me = me
        },
        avatarUpdate(state, avatarurl) {
            state.avatarurl = avatarurl
            if (state.me != null) {
                state.me.avatarurl = avatarurl
            }
        }
    }
}
