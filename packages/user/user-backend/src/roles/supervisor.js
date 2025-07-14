import { nonPrivilegedRolesReadOnly } from "../services/InitService.js";

import RoleService from "../services/RoleService.js";

import {
    SECURITY_ROLE_SHOW_CHILD,

    SECURITY_GROUP_SHOW,

    SECURITY_DASHBOARD_SHOW,
    SECURITY_ADMIN_MENU,

    SECURITY_USER_CREATE,
    SECURITY_USER_DELETE,
    SECURITY_USER_EDIT,
    SECURITY_USER_SHOW
} from "../permissions/include/security-permissions.js";


export default async function supervisorRole() {

    const supervisorRole = {
        name: "supervisor",
        permissions: [
            SECURITY_USER_CREATE,
            SECURITY_USER_DELETE,
            SECURITY_USER_EDIT,
            SECURITY_USER_SHOW,
            SECURITY_ROLE_SHOW_CHILD,
            SECURITY_GROUP_SHOW,
            SECURITY_DASHBOARD_SHOW,
            SECURITY_ADMIN_MENU,
        ],
        readonly: nonPrivilegedRolesReadOnly
    }

    const operatorRole = await RoleService.findRoleByName("operator")

    if (operatorRole) {
        supervisorRole.childRoles = [operatorRole.id]
    }

    return supervisorRole
}
