//Components
import DashboardButton from "./components/DashboardButton";
import AppBarUserMenu from "./components/AppBarUserMenu";
import UserCombobox from "./components/UserCombobox";
import RoleCombobox from "./components/RoleCombobox";
import UserAutocomplete from "./components/UserAutocomplete";
import GroupAutocomplete from "./components/GroupAutocomplete";
import UserView from "./components/UserView";

//Pages
import UserManagementPage from './pages/UserManagementPage'
import RoleManagementPage from './pages/RoleManagementPage'
import GroupManagementPage from './pages/GroupManagementPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ActivationPage from './pages/ActivationPage'
import RecoveryPage from './pages/RecoveryPage'
import ProfilePage from './pages/ProfilePage'
import DashboardPage from './pages/DashboardPage'

//Resources
import i18nMessages from './i18n/messages'
import UserModuleStore from './store/UserModule'

//Providers
import authProvider from "./providers/AuthProvider";
import userProvider from "./providers/UserProvider";
import roleProvider from "./providers/RoleProvider";
import groupProvider from "./providers/GroupProvider";
import profileProvider from "./providers/ProfileProvider";
import recoveryProvider from "./providers/RecoveryProvider";
import sessionProvider from "./providers/SessionProvider";

//Routes
import routes from "./routes";

import ClientError from './errors/ClientError'

const setGraphQlClientToProviders = (graphQlClient) => {
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

    //Initialice gqlc
    setGraphQlClientToProviders
}
