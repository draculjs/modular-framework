//Resources
import i18nMessages from './i18n/index.js'
import routes from './routes/index.js'

//Providers
import FileProvider from './providers/FileProvider.js'
import UploadProvider from './providers/UploadProvider.js'
import FileMetricsProvider from './providers/FileMetricsProvider.js'
import UserStorageProvider from './providers/UserStorageProvider.js'

//Components
import FileUploadExpiration from './components/FileUploadExpiration/FileUploadExpiration.vue'
import FileUploadExpress from './components/FileUploadExpress/FileUploadExpress.vue'
import FileUpload from './components/FileUpload/FileUpload.vue'
import FileUploadButton from './components/FileUploadButton/FileUploadButton.vue'
import FileView from './components/FileView/FileView.vue'
import MediaField from './components/MediaField/MediaField.vue'

//Pages
import FileManagementPage from './pages/FileManagementPage/index.vue'
import FileCreate from './pages/FileManagementPage/FileCreate/FileCreate.vue'
import FileCrud from './pages/FileManagementPage/FileCrud/FileCrud.vue'
import FileDelete from './pages/FileManagementPage/FileDelete/FileDelete.vue'
import FileForm from './pages/FileManagementPage/FileForm/FileForm.vue'
import FileList from './pages/FileManagementPage/FileList/FileList.vue'
import FileShow from './pages/FileManagementPage/FileShow/FileShow.vue'
import FileUpdate from './pages/FileManagementPage/FileUpdate/FileUpdate.vue'


//Mixins
import readableBytesMixin from "./mixins/readableBytesMixin.js";

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
