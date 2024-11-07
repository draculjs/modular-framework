import { nonPrivilegedRolesReadOnly } from "@dracul/user-backend/";
module.exports = {
    name: "manager",
    permissions: [
        "SECURITY_GROUP_SHOW"
    ],
    readonly: nonPrivilegedRolesReadOnly
}