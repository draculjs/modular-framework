//Resources
import i18nMessages from './modules/media/i18n'
import routes from './modules/media/routes'

//Providers
import FileProvider from './modules/media/providers/FileProvider'
import UploadProvider from './modules/media/providers/UploadProvider'
import FileMetricsProvider from './modules/media/providers/FileMetricsProvider'
import UserStorageProvider from './modules/media/providers/UserStorageProvider'

//Components
import FileUploadExpiration from './modules/media/components/FileUploadExpiration'
import FileUploadExpress from './modules/media/components/FileUploadExpress'
import FileUpload from './modules/media/components/FileUpload'
import FileUploadButton from './modules/media/components/FileUploadButton'
import FileView from './modules/media/components/FileView'
import MediaField from './modules/media/components/MediaField'

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
    FileMetricsProvider,
    UserStorageProvider,

    //Components
    FileUploadExpiration,
    FileUploadExpress,
    FileUpload,
    FileView,
    MediaField,
    FileUploadButton,

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
