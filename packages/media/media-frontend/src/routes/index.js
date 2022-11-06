import FileManagementPage from '../pages/FileManagementPage'
import UserStoragePage from '../pages/UserStoragePage'


const routes = [
    {
        name: 'FileManagementPage',
        path: '/file-management',
        component: FileManagementPage
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

]

export default routes;
