import { nonPrivilegedRolesReadOnly } from "../services/InitService.js"

export default function operatorRole(){
    return {
        name: "operator",
        permissions: [],
        readonly: nonPrivilegedRolesReadOnly
    }
}