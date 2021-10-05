import {DefaultLogger as winston} from "@dracul/logger-backend";
import { RoleService } from "@dracul/user-backend";
import RBAC from '../rbac';

const rbacFactory = function () {
    return new Promise(async (resolve, reject) => {
        try{
            const role = await RoleService.findRoles()
            resolve(new RBAC(role))
        }catch(err){
            winston.error("RbacService.RbacFactory ", err)
            reject(err)
        }
    })
}


const UserRbacFactory = async function (user) {
    return new Promise((resolve, reject) => {

        rbacFactory()
            .then(rbac => {

                    if (user && user.role && user.role.name) {
                        rbac.addUserRoles(user.id, [user.role.name])
                    } else {
                        reject("UserRbacFactory need user.role.name")
                    }

                    resolve(rbac)
                }
            )
            .catch(err => {
                winston.error("RbacService.UserRbacFactory ", err)
                reject(err)
            })


    })

}

export {rbacFactory, UserRbacFactory}
