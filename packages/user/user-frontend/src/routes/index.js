import LoginPage from '../pages/LoginPage/index.vue'
import DashboardPage from '../pages/DashboardPage/index.vue'
import UserManagementPage from '../pages/UserManagementPage/index.vue'
import GroupManagementPage from '../pages/GroupManagementPage/index.vue'
import RoleManagementPage from '../pages/RoleManagementPage/index.vue'
import RecoveryPage from '../pages/RecoveryPage/index.vue'
import RecoveryRequestPage from '../pages/RecoveryRequestPage/index.vue'
import ActivationPage from '../pages/ActivationPage/index.vue'
import ProfilePage from '../pages/ProfilePage/index.vue'
import RegisterPage from '../pages/RegisterPage/index.vue'
import PasswordPage from '../pages/PasswordPage/index.vue'

const routes = [
    {
        name: "login",
        path: '/login',
        component: LoginPage
    },

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
        name: "password",
        path: '/password',
        component: PasswordPage,
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
