import { nonPrivilegedRolesReadOnly } from "@dracul/user-backend/";

export default {
    name: "operator",
    permissions: [
        "SECURITY_GROUP_SHOW"
    ],
    readonly: nonPrivilegedRolesReadOnly
}