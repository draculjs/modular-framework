import notificationPage from '../pages/notificationPage'

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