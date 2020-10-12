import {DefaultLogger as winston} from '@dracul/logger-backend';
import bcryptjs from "bcryptjs";
import {createSession} from "./SessionService";
import jsonwebtoken from "jsonwebtoken";
import {createLoginFail} from "./LoginFailService";
import {findUser, findUserByUsername} from "./UserService";


export const tokenSignPayload = function (user, session) {
    return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        groups: user.groups,
        avatarurl: user.avatarurl,
        idSession: session.id
    };
}


export const auth = async function ({username, password}, req) {
    return new Promise((resolve, reject) => {
        findUserByUsername(username).then(user => {


            if (!user) {
                winston.warn('AuthService.auth: UserDoesntExist => ' + username)
                reject('UserDoesntExist')
            }

            if (user && user.active === false) {
                winston.warn('AuthService.auth: DisabledUser => ' + username)
                reject('DisabledUser')
            }

            if (user) {
                if (bcryptjs.compareSync(password, user.password)) {

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

                        resolve({token, payload, options})

                    }).catch(err => {
                        winston.error('AuthService.auth.createSession ', err)
                        reject(err)
                    })

                } else {
                    winston.warn('AuthService.auth: BadCredentials =>' + username)
                    createLoginFail(username, req)
                    reject('BadCredentials')
                }
            }
        })

    })
}


export const apiKey = function (userId, req) {
    return new Promise(async (resolve, reject) => {
        findUser(userId).then(user => {

            const payload = {
                id: user.id,
                username: user.username,
                role: {name: user.role.name}
            }

            const options = {jwtid: user.id}

            if (user) {
                let token = jsonwebtoken.sign(
                    payload,
                    process.env.JWT_SECRET,
                    options
                )

                resolve({token, payload, options})
            }
            reject("User doesn't exist")

        }).catch(err => {
            winston.error('AuthService.apiKey ', err)
            reject(err)
        })
    })
}