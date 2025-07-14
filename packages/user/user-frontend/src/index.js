//Components
import DashboardButton from "./components/DashboardButton";
import AppBarUserMenu from "./components/AppBarUserMenu";
import UserCombobox from "./components/UserCombobox";
import RoleCombobox from "./components/RoleCombobox";
import UserAutocomplete from "./components/UserAutocomplete";
import GroupAutocomplete from "./components/GroupAutocomplete";
import GroupCombobox from "./components/GroupCombobox";
import UserView from "./components/UserView";

//Pages
import UserManagementPage from './pages/UserManagementPage/index.vue'
import RoleManagementPage from './pages/RoleManagementPage/index.vue'
import GroupManagementPage from './pages/GroupManagementPage/index.vue'
import LoginPage from './pages/LoginPage/index.vue'
import RegisterPage from './pages/RegisterPage/index.vue'
import ActivationPage from './pages/ActivationPage/index.vue'
import RecoveryPage from './pages/RecoveryPage/index.vue'
import ProfilePage from './pages/ProfilePage/index.vue'
import DashboardPage from './pages/DashboardPage/index.vue'

//Resources
import i18nMessages from './i18n/messages/index.js'
import UserModuleStore from './store/UserModule.js'

//Providers
import authProvider from "./providers/AuthProvider.js";
import userProvider from "./providers/UserProvider.js";
import roleProvider from "./providers/RoleProvider.js";
import groupProvider from "./providers/GroupProvider.js";
import profileProvider from "./providers/ProfileProvider.js";
import recoveryProvider from "./providers/RecoveryProvider.js";
import sessionProvider from "./providers/SessionProvider.js";

//Routes
import routes from "./routes";

import ClientError from './errors/ClientError'

export function setGraphQlClientToProviders(graphQlClient){
    console.log("graphQlClient: ", graphQlClient)
    authProvider.setGqlc(graphQlClient)
    userProvider.setGqlc(graphQlClient)
    roleProvider.setGqlc(graphQlClient)
    groupProvider.setGqlc(graphQlClient)
    profileProvider.setGqlc(graphQlClient)
    recoveryProvider.setGqlc(graphQlClient)
    sessionProvider.setGqlc(graphQlClient)
}

export {
    //ClientError
    ClientError,

    //Components
    DashboardButton,
    AppBarUserMenu,
    UserCombobox,
    RoleCombobox,
    UserAutocomplete,
    GroupAutocomplete,
    GroupCombobox,
    UserView,

    //Pages
    UserManagementPage,
    RoleManagementPage,
    GroupManagementPage,
    LoginPage,
    RegisterPage,
    ActivationPage,
    RecoveryPage,
    ProfilePage,
    DashboardPage,

    //Resources
    i18nMessages,
    UserModuleStore,
    routes,

    //Provider
    authProvider,
    userProvider,
    roleProvider,
    groupProvider,
    profileProvider,
    recoveryProvider,
    sessionProvider,
}
