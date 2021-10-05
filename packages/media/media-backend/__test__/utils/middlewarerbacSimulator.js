import {UserRbacFactory} from "../services/RbacService";


export default async function (req, res, next) {
    try {

        if(req && req.user){
            req.rbac = await UserRbacFactory(req.user)
        }

        next()
    } catch (error) {
        console.error("Rbac Middleware error:", error)
        next(error);
    }

}


import RBAC from "../rbac";
import RoleModel from "../models/RoleModel";

const rbacFactory = function () {
    return new Promise((resolve, reject) => {

        RoleModel.find({}).then(roles => {
            resolve(new RBAC(roles))
        }).catch(err => {
            winston.error("RbacService.RbacFactory ", err)
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
                winston.error("RbacService.UserRbacFactory ", err)
                reject(err)
            })


    })

}
