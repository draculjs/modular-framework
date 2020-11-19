
const notificationStore = {
    state: {
        activateWebSocket: false,
        notificationPollTime:30000
    },
    getters:{
        getActivateWebSocket: state => {
            return state.activateWebSocket
        },
        getNotificationPollTime: state => {
            return state.notificationPollTime
        }
    },
    mutations:{
        setActivateWebSocket(state, activateWebSocket){
            state.activateWebSocket = activateWebSocket
        },
        setNotificationPollTime(state, notificationPollTime){
            state.notificationPollTime = notificationPollTime
        }
    },

}

export default notificationStore