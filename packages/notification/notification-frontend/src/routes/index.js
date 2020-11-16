import notificationPage from '../pages/NotificationPage'

export const notificationRoutes = [
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