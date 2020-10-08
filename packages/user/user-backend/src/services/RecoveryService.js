import User from "../models/UserModel";
import {createUserAudit} from "./UserAuditService";
import jwt from "jsonwebtoken";
import UserEmailManager from "./UserEmailManager";
import {hashPassword} from "./UserService";
import validatePasswordLength from "./utils/validatePasswordLength";
import {session} from "./AuthService";


/*
    @input email: String
    @output {status:Boolean!,message:String}
 */
export const recoveryPassword = function (email) {

    return new Promise((resolve, rejects) => {
        User.findOne({email: email}).populate('role').then((user) => {
            if (user) {
                let token = jwt.sign(
                    {
                        id: user.id,
                        operation: 'recovery'
                    },
                    process.env.JWT_SECRET,
                    {expiresIn: '1d'}
                )
                let url = process.env.APP_WEB_URL + "/recovery/" + token

                UserEmailManager.recovery(email, url, user).then(result => {
                    createUserAudit(user.id, user.id, 'passwordRecovery')
                    resolve({status: result, message: 'common.operation.success'})
                }).catch(error => {
                    rejects(new Error('common.operation.fail'))
                })


            } else resolve({status: false, message: "user.notFound"})
        }).catch((error) => {
            if (error) rejects(new Error('common.operation.fail'))
        })
    })
}

/*
    @input (token: String, newPassword:String, actionBy: Object, req: Object )
    @output {status:Boolean!, message:String}
 */
export const recoveryChangePassword = function (token, newPassword, req) {

    return new Promise((resolve, rejects) => {

        let decoded = jwt.verify(token, process.env.JWT_SECRET)

        //Todo specific message
        if (!decoded) {
            resolve({status: false, message: "common.operation.fail"})
        }

        //Todo specific message
        if (!validatePasswordLength(newPassword)) {
            resolve({status: false, message: "common.operation.fail"})
        }

        User.findOneAndUpdate(
            {_id: decoded.id}, {password: hashPassword(newPassword)}, {new: true},
            (error, user) => {

                if (error) {
                    resolve({status: false, message: "common.operation.fail"})
                } else {

                    session(user, req).then(authToken => {
                        createUserAudit(decoded.id, decoded.id, 'userRecoveryPasswordChange')
                        resolve({status: true, token: authToken, message: "common.operation.success"})
                    }).catch(err => {
                        rejects(err)
                    })


                }
            }
        )

    })
}

