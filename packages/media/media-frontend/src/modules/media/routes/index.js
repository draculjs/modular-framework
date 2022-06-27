import FileManagementPage from '../pages/FileManagementPage'
import FileDashboardPage from '../pages/FileDashboardPage'
import UserStoragePage from '../pages/UserStoragePage'
import PdfWebViewer from '../components/PdfWebViewer'

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
        component: UserStoragePage,
        meta: {
            requeresAuth: true,
            permission: "USER_STORAGE_SHOW_ALL"
        }
    },
    {
        name: 'PdfWebViewer',
        path: '/pdf-viewer',
        component: PdfWebViewer,
        props: route => ({ url: route.query.url })
    }
]

export default routes;
