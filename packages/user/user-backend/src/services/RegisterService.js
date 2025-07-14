import {DefaultLogger as winston} from '@dracul/logger-backend';
import {UserInputError} from "apollo-server-errors";
import jsonwebtoken from "jsonwebtoken";

import UserEmailManager from "./UserEmailManager.js";
import {tokenSignPayload} from "./AuthService.js";
import {createSession} from "./SessionService.js";
import RoleService from "./RoleService.js";
import UserService from "./UserService.js";
import User from "../models/UserModel.js";

export const registerUser = function ({username, password, name, email, phone}) {
    return new Promise(async (resolve, reject) => {
        const ROLE_NAME = process.env.REGISTER_ROLE ? process.env.REGISTER_ROLE : "operator"

        let roleObject = await RoleService.findRoleByName(ROLE_NAME)
        let active = false

        const newUser = new User({
            username,
            email,
            password: UserService.hashPassword(password),
            name,
            phone,
            active,
            role: roleObject,
            createdAt: Date.now(),
            lastPasswordChange: new Date()
        })
        newUser.id = newUser._id

        newUser.save((error => {
            if (error) {
                if (error.name == "ValidationError") {
                    winston.warn("RegisterService.registerUser.ValidationError ", error)
                    reject(new UserInputError(error.message, {inputErrors: error.errors}))
                } else {
                    winston.error("RegisterService.registerUser ", error)
                }
                reject(error)
            } else {
                let token = jsonwebtoken.sign(
                    {
                        id: newUser.id,
                        operation: 'register'
                    },
                    process.env.JWT_SECRET,
                    {expiresIn: process.env.JWT_REGISTER_EXPIRED_IN || '30d'}
                )


                const url = `${process.env.APP_WEB_URL}/activation/${token}`
                UserEmailManager.activation(newUser.email, url, newUser);


                winston.info("RegisterService.registerUser successful for " + newUser.username)
                resolve({status: true, id: newUser.id, email: newUser.email});
            }
        }))

    })

}

export const activationUser = function (token, req) {

    return new Promise((resolve, reject) => {
        const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET)
        if (!decoded) resolve({status: false, message: "common.operation.fail"})

        User.findOneAndUpdate(
            {_id: decoded.id},
            {active: true}
        )
            .populate(['role','groups'])
            .exec(
                (error, user) => {

                    if (error) {
                        winston.error("RegisterService.activationUser.findOneAndUpdate ", error)
                        resolve({status: false, message: "common.operation.fail"})
                    }


                    createSession(user, req).then(session => {

                        const payload = tokenSignPayload(user, session.id)

                        const options = {
                            expiresIn: process.env.JWT_LOGIN_EXPIRED_IN || '1d',
                            jwtid: user.id
                        }

                        let token = jsonwebtoken.sign(
                            payload,
                            process.env.JWT_SECRET,
                            options
                        )

                        winston.info("RegisterService.activationUser successful for " + user.username)
                        resolve({status: true, token: token, message: "common.operation.success"})

                    }).catch(error => {
                        winston.error("RegisterService.activationUser ", error)
                        reject(error)
                    })


                }
            )
    })
}
