import { nonPrivilegedRolesReadOnly } from "@dracul/user-backend";

export const desarrolloRole = {
    name: "Desarrollo",
    permissions: [
        "SECURITY_GROUP_SHOW"
    ],
    readonly: nonPrivilegedRolesReadOnly
}

export default desarrolloRole