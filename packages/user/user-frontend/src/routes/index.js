import LoginPage from '../pages/LoginPage'
import DashboardPage from '../pages/DashboardPage'
import UserManagementPage from '../pages/UserManagementPage'
import GroupManagementPage from '../pages/GroupManagementPage'
import RoleManagementPage from '../pages/RoleManagementPage'
import RecoveryPage from '../pages/RecoveryPage'
import RecoveryRequestPage from '../pages/RecoveryRequestPage'
import ActivationPage from '../pages/ActivationPage'
import ProfilePage from '../pages/ProfilePage'
import RegisterPage from '../pages/RegisterPage'

const routes = [
    {
        name: "login", 
        path: '/login', 
        component: LoginPage},
    {
        name: "recovery", 
        path: '/recovery/:token', 
        component: RecoveryPage},
    {
        name: "recoveryRequest", 
        path: '/recovery', 
        component: RecoveryRequestPage},
    {
        name: "activation", 
        path: '/activation/:token', 
        component: ActivationPage},
    {
        name: "register", 
        path: '/register', 
        component: RegisterPage},
    {
        name: "me", 
        path: '/me', 
        component: ProfilePage, 
        meta: {
            requiresAuth: true
        } 
    },
    {
        name: "userDashboard", 
        path: '/user-dashboard', 
        component: DashboardPage, 
        meta: {
            requiresAuth: true,
            permission: "SECURITY_DASHBOARD_SHOW"
        } 
    },
    {
        name: "userManagement", 
        path: '/user-management', 
        component: UserManagementPage, 
        meta: {
            requiresAuth: true,
            permission: "SECURITY_USER_SHOW"
        } 
    },
    {
        name: "groupManagement", 
        path: '/group-management', 
        component: GroupManagementPage, 
        meta: {
            requiresAuth: true,
            permission: "SECURITY_GROUP_SHOW"
        } 
    },
    {
        name: "roleManagement", 
        path: '/role-management', 
        component: RoleManagementPage, 
        meta: {
            requiresAuth: true,
            permission: "SECURITY_ROLE_SHOW"
        } 
    },

]

export default routes;
