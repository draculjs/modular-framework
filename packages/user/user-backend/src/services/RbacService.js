import RBAC from "../rbac";
import RoleModel from "../models/RoleModel";

const rbacFactory = function () {
    return new Promise((resolve, reject) => {

        RoleModel.find({}).then(roles => {
            resolve(new RBAC(roles))
        }).catch(err => {
            console.error("RbacFactory Error:", err)
            reject(err)
        })

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
                console.error("UserRbacFactory Error:", err)
                reject(err)
            })


    })

}

export {rbacFactory, UserRbacFactory}
