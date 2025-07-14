export default [
    {
        icon: 'mdi-home',
        text: 'base.home',
        link: { name: "home" },
        galleryHide: true
    },

    {
        icon: 'mdi-folder-multiple',
        text: 'Media Explorer',
        link: { name: "home" },
        requiresAuth: true,
        permission: "FILE_SHOW_OWN",
        children: [
            {
                icon: 'mdi-file-cabinet',
                text: 'media.file.title',
                link: { name: "FileManagementPage" },
                requiresAuth: true,
                permission: "FILE_SHOW_OWN"
            },
            {
                icon: 'mdi-view-dashboard',
                text: 'media.userStorage.title',
                link: { name: "UserStoragePage" },
                requiresAuth: true,
                permission: "USER_STORAGE_SHOW_ALL"
            }
        ]
    },

    {
        icon: 'mdi-account',
        text: 'menu.administration',
        panel: false,
        permission: 'SECURITY_ADMIN_MENU',
        children: [
            {
                icon: 'mdi-account-multiple',
                text: 'user.title',
                link: { name: "userManagement" },
                panel: false,
                permission: 'SECURITY_USER_SHOW'
            },
            {
                icon: 'mdi-shield-account',
                text: 'role.title',
                link: { name: "roleManagement" },
                panel: false,
                permission: 'SECURITY_ROLE_SHOW'
            },
            {
                icon: 'mdi-account-group',
                text: 'group.title',
                link: { name: "groupManagement" },
                panel: false,
                permission: 'SECURITY_GROUP_SHOW'
            },
            {
                icon: 'mdi-palette',
                text: 'menu.customization',
                link: { name: "customization" },
                panel: false,
                permission: 'CUSTOMIZATION_SHOW'
            },
            {
                icon: 'mdi-cog',
                text: 'menu.settings',
                link: { name: "SettingsPage" },
                panel: false,
                permission: 'SETTINGS_CREATE'
            },
            {
                icon: 'mdi-cctv',
                text: 'menu.audit',
                link: { name: "AuditPage" },
                panel: false,
                permission: 'AUDIT_MENU'
            }
        ]
    }
]