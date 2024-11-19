import { nonPrivilegedRolesReadOnly } from "../services/InitService"

function operatorRole(){
    return {
        name: "operator",
        permissions: [],
        readonly: nonPrivilegedRolesReadOnly
    }
}


export default operatorRole