import baseProvider from "../providers/BaseProvider";

export default {
    state: {
        title: "App Name",
        serverStatus: false,
        serverTime: null,
        serverError: null,
        graphqlErrors: [],
        graphqlErrorsCounter: 0
    },
    getters: {
        getGraphqlErrors: (state) => {
            return state.graphqlErrors
        },
        getTitle: (state) => {
            return state.title
        },
        getServerStatus: (state) => {
            return state.serverStatus
        }
    },
    actions: {
        ping({commit}) {
            let begin = Date.now()
            baseProvider.ping().then(r => {
                let time =  Date.now() - begin
                commit('setServerStatus', r.data.ping.status)
                commit('setServerTime', time)

            }).catch(e => {
                commit('setServerStatus', false)
                commit('setServerTime', 0)
                commit('setServerError', e.message)
            })
        }
    },
    mutations: {
        addGraphqlError(state,error){
            error.key = state.graphqlErrorsCounter
            state.graphqlErrors.push(error)
            state.graphqlErrorsCounter++
        },
        removeGraphqlError(state){
            state.graphqlErrors.shift()
        },
        clearGraphqlError(state){
            state.graphqlErrors = []
        },
        setServerStatus(state, status) {
            state.serverStatus = status
        },
        setServerTime(state, time) {
            state.serverTime = time
        },
        setServerError(state, error) {
            state.serverError = error
        }
    }
}
