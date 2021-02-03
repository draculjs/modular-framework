import notificationPage from '../pages/NotificationPage'

const notificationRoutes = [
    {
        name: "notifications",
        path: '/notifications',
        component: notificationPage,
        meta: {
            requiresAuth: true,
            permission: "NOTIFICATION_SHOW"
        }
    }
]

export default notificationRoutes
