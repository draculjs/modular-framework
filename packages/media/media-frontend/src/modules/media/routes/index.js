import FileManagementPage from '../pages/FileManagementPage'
import FileDashboardPage from '../pages/FileDashboardPage'
import UserStoragePage from '../pages/UserStoragePage'

const routes = [
    {
        name: 'FileManagementPage',
        path: '/file-management',
        component: FileManagementPage
    },
    {
        name: 'FileDashboardPage',
        path: '/file-dashboard',
        component: FileDashboardPage,
        meta: {
            requiresAuth: true,
            permission: "FILE_SHOW_ALL"
        }
    },
    {
        name: 'UserStoragePage',
        path: '/user-storage',
        component: UserStoragePage
    }
]

export default routes;
