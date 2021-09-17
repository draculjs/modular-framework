import QueueStatsPage from '../pages/QueueStatsPage'
import JobsPage from '../pages/JobsPage'
import JobPage from '../pages/JobPage'

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
        name: 'JobsPage',
        path: '/jobs',
        component: JobsPage,
        meta: {
            requiresAuth: true,
            permission: "QUEUE_SHOW"
        }
    },
    {
        name: 'JobPage',
        path: '/jobs/:id',
        component: JobPage,
        meta: {
            requiresAuth: true,
            permission: "QUEUE_SHOW"
        }
    },


]

export default routes


