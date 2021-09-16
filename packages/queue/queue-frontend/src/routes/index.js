import QueueStatsPage from '../pages/QueueStatsPage'
import QueueManagementPage from '../pages/QueueManagementPage'

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
    {
        name: 'QueueManagementPage',
        path: '/queues',
        component: QueueManagementPage,
        meta: {
            requiresAuth: true,
            permission: "QUEUE_SHOW"
        }
    },


]

export default routes


