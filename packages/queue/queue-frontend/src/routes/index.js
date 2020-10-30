import QueueStatsPage from '../pages/QueueStatsPage'

 const routes = [
    {
        name: "queueStats",
        path: '/queue-stats',
        component: QueueStatsPage,
        meta: {
            requiresAuth: true,
            permission: "QUEUE_SHOW"
        }
    },

]

export default routes
