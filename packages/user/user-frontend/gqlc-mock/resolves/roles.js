const resolve = {
    data: {
        roles: [
            {
                id: 1,
                name: 'admin',
                childRoles: [],
                permissions: [
                    "SECURITY_USER_CREATE",
                    "SECURITY_USER_EDIT",
                    "SECURITY_USER_SHOW",
                    "SECURITY_USER_DELETE",
                    "SECURITY_DASHBOARD_SHOW",
                    "SECURITY_ADMIN_MENU",
                    "SECURITY_GROUP_CREATE",
                    "SECURITY_GROUP_DELETE",
                    "SECURITY_GROUP_EDIT",
                    "SECURITY_GROUP_SHOW",
                    "SECURITY_ROLE_CREATE",
                    "SECURITY_ROLE_EDIT",
                    "SECURITY_ROLE_SHOW",
                    "SECURITY_ROLE_DELETE",
                ]
            },
            {
                id: 2,
                name: 'supervisor',
                childRoles: [],
                permissions: ["SECURITY_USER_SHOW"]
            },
            {
                id: 3,
                name: 'operator',
                childRoles: [],
                permissions: ["SECURITY_USER_SHOW"]
            }
        ]
    }
}

export default resolve