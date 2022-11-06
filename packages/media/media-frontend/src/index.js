//Resources
import i18nMessages from './i18n'
import routes from './routes'

//Providers
import FileProvider from './providers/FileProvider'
import UploadProvider from './providers/UploadProvider'
import FileMetricsProvider from './providers/FileMetricsProvider'
import UserStorageProvider from './providers/UserStorageProvider'

//Components
import FileUploadExpiration from './components/FileUploadExpiration'
import FileUploadExpress from './components/FileUploadExpress'
import FileUpload from './components/FileUpload'
import FileUploadButton from './components/FileUploadButton'
import FileView from './components/FileView'
import MediaField from './components/MediaField'

//Pages
import FileManagementPage from './pages/FileManagementPage/index'
import FileCreate from './pages/FileManagementPage/FileCreate'
import FileCrud from './pages/FileManagementPage/FileCrud'
import FileDelete from './pages/FileManagementPage/FileDelete'
import FileForm from './pages/FileManagementPage/FileForm'
import FileList from './pages/FileManagementPage/FileList'
import FileShow from './pages/FileManagementPage/FileShow'
import FileUpdate from './pages/FileManagementPage/FileUpdate'


//Mixins
import readableBytesMixin from "./mixins/readableBytesMixin";

export {
    //i18n
    i18nMessages,

    //Routes
    routes,

    //Mixins
    readableBytesMixin,

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
    FileUpdate
}
