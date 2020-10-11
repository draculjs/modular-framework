//Resources
import i18nMessages from './modules/media/i18n/messages'
import routes from './modules/media/routes'

//Providers
import FileProvider from './modules/media/providers/FileProvider'
import UploadProvider from './modules/media/providers/UploadProvider'

//Components
import FileUploadExpress from './modules/media/components/FileUploadExpress'
import FileUpload from './modules/media/components/FileUpload'
import FileView from './modules/media/components/FileView'

//Pages
import FileManagementPage from './modules/media/pages/FileManagementPage/index'
import FileCreate from './modules/media/pages/FileManagementPage/FileCreate'
import FileCrud from './modules/media/pages/FileManagementPage/FileCrud'
import FileDelete from './modules/media/pages/FileManagementPage/FileDelete'
import FileForm from './modules/media/pages/FileManagementPage/FileForm'
import FileList from './modules/media/pages/FileManagementPage/FileList'
import FileShow from './modules/media/pages/FileManagementPage/FileShow'
import FileUpdate from './modules/media/pages/FileManagementPage/FileUpdate'

import FileDashboardPage from './modules/media/pages/FileDashboardPage'

export {
    i18nMessages,
    routes,

    //Providers
    FileProvider,
    UploadProvider,

    //Components
    FileUploadExpress,
    FileUpload,
    FileView,

    //Pages
    FileManagementPage,
    FileCreate,
    FileCrud,
    FileDelete,
    FileForm,
    FileList,
    FileShow,
    FileUpdate,

    FileDashboardPage

}