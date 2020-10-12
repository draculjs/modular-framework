import {DefaultLogger as winston} from '@dracul/logger-backend';
import {findRoleByName} from "./RoleService";
import User from "../models/UserModel";
import {UserInputError} from "apollo-server-express";
import jsonwebtoken from "jsonwebtoken";
import {createUserAudit} from "./UserAuditService";
import UserEmailManager from "./UserEmailManager";
import {hashPassword} from "./UserService";
import {session, tokenSignPayload} from "./AuthService";
import {createSession} from "./SessionService";

export const registerUser = async function ({username, password, name, email, phone}) {

    //TODO improve this hardcode role
    const ROLE_NAME = "operator";
    let roleObject = await findRoleByName(ROLE_NAME)

    return new Promise((resolve, rejects) => {

        let active = false;

        const newUser = new User({
            username,
            email,
            password: hashPassword(password),
            name,
            phone,
            active,
            role: roleObject,
            createdAt: Date.now()

        })
        newUser.id = newUser._id;

        newUser.save((error => {
            if (error) {
                if (error.name == "ValidationError") {
                    winston.warn("RegisterService.registerUser.ValidationError ", error)
                    rejects(new UserInputError(error.message, {inputErrors: error.errors}));
                }else{
                    winston.error("RegisterService.registerUser ", error)
                }
                rejects(error)
            } else {
                let token = jsonwebtoken.sign(
                    {
                        id: newUser.id,
                        operation: 'register'
                    },
                    process.env.JWT_SECRET,
                    {expiresIn: process.env.JWT_REGISTER_EXPIRED_IN || '30d'}
                )
                let url = process.env.APP_WEB_URL + "/activation/" + token
                createUserAudit(newUser.id, newUser.id, 'userRegistered')
                UserEmailManager.activation(newUser.email, url, newUser);
                resolve({status: true, id: newUser.id, email: newUser.email});
            }
        }))

    })

}

export const activationUser = function (token, req) {


    return new Promise((resolve, rejects) => {

        let decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET)

        //Todo specific message
        if (!decoded) {
            resolve({status: false, message: "common.operation.fail"})
        }

        User.findOneAndUpdate(
            {_id: decoded.id},
            {active: true},
            (error, user) => {

                if (error) {
                    winston.error("RegisterService.activationUser.findOneAndUpdate ", error)
                    resolve({status: false, message: "common.operation.fail"})
                }

                createUserAudit(user._id, user._id, 'userActivated')

                createSession(user, req).then(session => {

                    const payload = tokenSignPayload(user, session)

                    const options = {
                        expiresIn: process.env.JWT_LOGIN_EXPIRED_IN || '1d',
                        jwtid: user.id
                    }

                    let token = jsonwebtoken.sign(
                        payload,
                        process.env.JWT_SECRET,
                        options
                    )


                    resolve({status: true, token: token, message: "common.operation.success"})

                }).catch(err => {
                    winston.error("RegisterService.activationUser ", error)
                    reject(err)
                })


            })

    })
}