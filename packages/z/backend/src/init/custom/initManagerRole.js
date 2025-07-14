import { nonPrivilegedRolesReadOnly } from "@dracul/user-backend";
export const managerRole = {
    name: "manager",
    permissions: [
        "SECURITY_GROUP_SHOW"
    ],
    readonly: nonPrivilegedRolesReadOnly
}

export default managerRole