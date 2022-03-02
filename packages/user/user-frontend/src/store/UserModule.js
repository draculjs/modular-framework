import AuthProvider from '../providers/AuthProvider'
import jwt_decode from 'jwt-decode'
import ClientError from '../errors/ClientError'

export default {
    state: {
        access_token: null,
        refresh_token: {
            token: null,
            expiryDate: null
        },
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
        getRefreshToken: (state) => {
            return state.refresh_token
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
        tokenIsExpired: (state) => {
            try {

                if (!state.access_token) {
                    return true
                }

                let payload = jwt_decode(state.access_token)

                if (!payload.exp) {
                    return true
                }

                let dateNow = new Date();
                let dateToken = new Date(payload.exp * 1000)
                if (dateNow > dateToken) {
                    return true
                }

                return false

            } catch (err) {
                console.error(err)
                return true
            }

        },
        refreshTokenIsExpired: (state) => {

            if (!state.refresh_token || !state.refresh_token.expiryDate) {
                return true
            }

            let dateNow = new Date();
            let expiryDate = new Date(parseInt(state.refresh_token.expiryDate))

            if (dateNow > expiryDate) {
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

        login({commit, dispatch}, {username, password}) {

            return new Promise((resolve, reject) => {

                function errorHandler(err) {
                    let error = new ClientError(err)

                    if (error.code === 'UNAUTHENTICATED' && error.errorMessage === 'BadCredentials') {
                        return reject('auth.badCredentials')
                    }

                    return reject(error.i18nMessage)
                }

                AuthProvider.auth(username, password)
                    .then((response) => {
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
            commit('setRefreshToken', {token: null, expiryDate: null})
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
            if (getters.refreshTokenIsExpired) {
                dispatch('logout')
            } else if (state.me === null) {
                dispatch('fetchMe')
            }
        },

        validateSession: ({dispatch, getters, commit}) => {
            return new Promise((resolve) => {
                if (getters.tokenIsExpired === true && getters.refreshTokenIsExpired === false) {
                    //Puedo Renovar
                    dispatch('renewToken')
                        .then(token => {
                            commit('setAccessToken', token)
                            resolve(true)
                        })
                        .catch(e => {
                            console.log("Error on renewToken", e)
                            dispatch('logout')
                        })
                }else if (getters.tokenIsExpired === false){
                    resolve(true)
                }else if(getters.refreshTokenIsExpired === true){
                    resolve(false)
                    dispatch('logout')
                }
            })
        },

        renewToken: ({getters}) => {
            return new Promise((resolve, reject) => {
                let {id} = getters.getRefreshToken
                AuthProvider.refreshToken(id)
                    .then(r => {
                        let token = r.data.refreshToken.token
                        resolve(token)
                    })
                    .catch(e => {
                        reject(e)
                    })
            })

        }

    },

    mutations: {
        setAccessToken(state, access_token) {
            state.access_token = access_token
        }
        ,
        setRefreshToken(state, refresh_token) {
            state.refresh_token.token = refresh_token.token
            state.refresh_token.expiryDate = refresh_token.expiryDate
        }
        ,
        setMe(state, me) {
            state.me = me
        }
        ,
        avatarUpdate(state, avatarurl) {
            state.avatarurl = avatarurl
            if (state.me != null) {
                state.me.avatarurl = avatarurl
            }
        }
    }
}
