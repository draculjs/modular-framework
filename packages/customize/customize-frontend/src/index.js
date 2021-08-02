import CustomConfigPage from "./pages/CustomConfigPage/CustomConfigPage";
import LogoToolbar from "./components/LogoToolbar";
import TitleToolbar from "./components/TitleToolbar";
import LogoPreview from "./components/LogoPreview";
import LanguageCombobox from "./components/LanguageCombobox";
import i18nMessages from './i18n/messages'
import customizationProvider from "./providers/CustomizationProvider";
import routes from './routes'
import CustomizationStore from './storage/CustomizationStore'

export {
    //Pages
    CustomConfigPage,
    //Components
    LogoToolbar,
    TitleToolbar,
    LogoPreview,
    LanguageCombobox,
    //i18n
    i18nMessages,
    //Providers
    customizationProvider,
    //Routes
    routes,
    //Vuex Store
    CustomizationStore


}
