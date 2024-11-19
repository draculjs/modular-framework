import {
    SECURITY_ROLE_SHOW_CHILD,

    SECURITY_GROUP_SHOW,

    SECURITY_DASHBOARD_SHOW,
    SECURITY_ADMIN_MENU,

    SECURITY_USER_CREATE,
    SECURITY_USER_DELETE,
    SECURITY_USER_EDIT,
    SECURITY_USER_SHOW
} from "../permissions";
import { nonPrivilegedRolesReadOnly } from "../services/InitService";

import {findRoleByName} from "../services/RoleService";

async function supervisorRole() {

    let supervisorRole = {
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

    const operatorRole = await findRoleByName("operator")
    if (operatorRole) {
        supervisorRole.childRoles = [operatorRole.id]
    }
    return supervisorRole
}

export default supervisorRole
