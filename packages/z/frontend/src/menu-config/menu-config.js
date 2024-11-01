
export default [
    {
        icon: 'home',
        text:'base.home',
        link: { name: "home" },
        galleryHide: true
    },

    {
        icon: 'perm_media',
        text:'Media Explorer',
        link: { name: "home" },
        requiresAuth: true,
        permission: "FILE_SHOW_OWN",
        children: [
            {
                icon: 'file_present',
                text: 'media.file.title',
                link: { name: "FileManagementPage" },
                requiresAuth: true,
                permission: "FILE_SHOW_OWN"
            },

            {
                icon: 'dashboard',
                text: 'media.userStorage.title',
                link: { name: "UserStoragePage" },
                requiresAuth: true,
                permission: "USER_STORAGE_SHOW_ALL"
            },

        ]
    },

    {
        icon: 'person',
        text: 'menu.administration',
        panel: false,
        permission: 'SECURITY_ADMIN_MENU',
        children: [


            {
                icon: 'assignment_ind',
                text: 'user.title',
                link: { name: "userManagement" },
                panel: false,
                permission: 'SECURITY_USER_SHOW'
            },
            {
                icon: 'verified_user',
                text: 'role.title',
                link: { name: "roleManagement" },
                panel: false,
                permission: 'SECURITY_ROLE_SHOW'
            },
            {
                icon: 'group',
                text: 'group.title',
                link: { name: "groupManagement" },
                panel: false,
                permission: 'SECURITY_GROUP_SHOW'
            },
            {
                icon: 'settings_applications',
                text: 'menu.customization',
                link: { name: "customization" },
                panel: false,
                permission: 'CUSTOMIZATION_SHOW'
            },
            {
                icon: 'settings',
                text: 'menu.settings',
                link: { name: "SettingsPage" },
                panel: false,
                permission: 'SETTINGS_CREATE'
            },
            {
                icon: 'privacy_tip',
                text: 'menu.audit',
                link: { name: "AuditPage" },
                panel: false,
                permission: 'AUDIT_MENU'
            },

        ]
    }


]
