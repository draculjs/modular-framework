import FileManagementPage from '../pages/FileManagementPage'
import FileDashboardPage from '../pages/FileDashboardPage'

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
    }
]

export default routes;
