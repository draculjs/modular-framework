import FileManagementPage from '../pages/FileManagementPage'
import FileDashboardPage from '../pages/FileDashboardPage'
import UserStoragePage from '../pages/UserStoragePage'
import pdfWebViewer from '../components/FileView/pdfViewer';

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
        name: 'pdfWebViewer',
        path: '/pdf-viewer',
        component: pdfWebViewer,
        props: route => ({ url: route.query.url })
    }
]

export default routes;
