import notificationPage from '../pages/NotificationPage'

const notificationRoutes = [
    {
        name: "notifications",
        path: '/notifications',
        component: notificationPage,
        meta: {
            requiresAuth: true,
            permission: "CUSTOMFIELDS_SHOW"
        }
    }
]

export default notificationRoutes