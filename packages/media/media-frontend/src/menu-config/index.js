import i18n from "../i18n";

export default [
    {
        icon: 'home',
        text: i18n.t('base.home'),
        link: {name: "home"},
        panel: false
    },
    {
        icon: 'description',
        text: i18n.t('media.file.title'),
        link: {name: "FileManagementPage"},
        panel: false,
    },
    {
        icon: 'dashboard',
        text: i18n.t('media.file.dashboardTitle'),
        link: {name: "FileDashboardPage"},
        panel: false,
    },
    {
        icon: 'person',
        text: 'Administrador',
        panel: false,
        permission: 'SECURITY_USER_SHOW',
        children: [
            {
                icon: 'assignment_ind',
                text: 'Dashboard',
                link: {name: "userDashboard"},
                panel: false,
                permission: 'SECURITY_DASHBOARD_SHOW'
            },
            {
                icon: 'settings_applications',
                text: 'Customization',
                link: {name: "customization"},
                panel: false,
                permission: 'CUSTOMIZATION_SHOW'
            },
            {
                icon: 'assignment_ind',
                text: i18n.t('user.title'),
                link: {name: "userManagement"},
                panel: false,
                permission: 'SECURITY_USER_SHOW'
            },
            {
                icon: 'verified_user',
                text: i18n.t('role.title'),
                link: {name: "roleManagement"},
                panel: false,
                permission: 'SECURITY_ROLE_SHOW'
            },
            {
                icon: 'group',
                text: i18n.t('group.title'),
                link: {name: "groupManagement"},
                panel: false,
                permission: 'SECURITY_GROUP_SHOW'
            },

        ]
    },
    {
        icon: 'perm_phone_msg',
        text: i18n.t('base.about'),
        link: {name: "about"},
        panel: false,
    },


]
