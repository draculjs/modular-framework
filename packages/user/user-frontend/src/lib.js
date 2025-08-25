import Vue from 'vue';
import UserManagementPage from './pages/UserManagementPage'
import RoleManagementPage from './pages/RoleManagementPage'
import GroupManagementPage from './pages/GroupManagementPage'

import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ActivationPage from './pages/ActivationPage'
import RecoveryPage from './pages/RecoveryPage'
import ProfilePage from './pages/ProfilePage'

import DashboardPage from './pages/DashboardPage'


const Components = {
    UserManagementPage,
    RoleManagementPage,
    GroupManagementPage,
    LoginPage,
    RegisterPage,
    ActivationPage,
    RecoveryPage,
    ProfilePage,
    DashboardPage
}

Object.keys(Components).forEach(name => {
    Vue.component(name, Components[name]);
});

export default Components;