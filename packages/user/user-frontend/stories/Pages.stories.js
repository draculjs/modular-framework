import {storiesOf} from '@storybook/vue';

import GroupManagementPage from '../src/pages/GroupManagementPage';
import RoleManagementPage from '../src/pages/RoleManagementPage';
import UserManagementPage from '../src/pages/UserManagementPage';

import LoginPage from '../src/pages/LoginPage';
import RegisterPage from '../src/pages/RegisterPage';
import ActivationPage from '../src/pages/ActivationPage';
import ProfilePage from '../src/pages/ProfilePage';
import RecoveryPage from '../src/pages/RecoveryPage';


import DashboardPage from '../src/pages/DashboardPage';

import store from '../src/store'
import i18n from '../src/i18n'
import router from '../src/router'

//Set Auth
store.dispatch('login',{username:'root',password:'123'})

storiesOf('Pages', module)
    .add('UserManagementPage',
        () => ({
            components: {UserManagementPage},
            template: '<user-management-page></user-management-page>',
            i18n, store, router
        }))
    .add('RoleManagementPage',
        () => ({
            components: {RoleManagementPage},
            template: '<role-management-page></role-management-page>',
            i18n, store, router
        }))
    .add('GroupManagementPage',
        () => ({
            components: {GroupManagementPage},
            template: '<group-management-page></group-management-page>',
            i18n, store, router
        }))
    .add('LoginPage',
        () => ({
            components: {LoginPage},
            template: '<login-page></login-page>',
            i18n, store, router
        }))
    .add('RegisterPage',
        () => ({
            components: {RegisterPage},
            template: '<register-page></register-page>',
            i18n, store, router
        }))
    .add('ActivationPage',
        () => ({
            components: {ActivationPage},
            template: '<activation-page></activation-page>',
            i18n, store, router
        }))
    .add('DashboardPage',
        () => ({
            components: {DashboardPage},
            template: '<dashboard-page></dashboard-page>',
            i18n, store, router
        }))
    .add('ProfilePage',
        () => ({
            components: {ProfilePage},
            template: '<profile-page></profile-page>',
            i18n, store, router
        }))
    .add('RecoveryPage',
        () => ({
            components: {RecoveryPage},
            template: '<recovery-page></recovery-page>',
            i18n, store, router
        }))

