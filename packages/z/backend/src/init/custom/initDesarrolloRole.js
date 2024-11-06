import { nonPrivilegedRolesReadOnly } from "@dracul/user-backend/";
module.exports = {
    name: "Desarrollo",
    permissions: [
        "SECURITY_GROUP_SHOW"
    ],
    readonly: nonPrivilegedRolesReadOnly
}
