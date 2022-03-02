import {DefaultLogger as winston} from '@dracul/logger-backend';
import bcryptjs from "bcryptjs";
import {createSession} from "./SessionService";
import jsonwebtoken from "jsonwebtoken";
import {createLoginFail} from "./LoginFailService";
import {findUser, findUserByRefreshToken, findUserByUsername, updateUser} from "./UserService";
import {decodePassword} from "./PasswordService"

const {v4: uuidv4} = require('uuid');


export const tokenSignPayload = function (user, sessionId) {
    return {
        id: user.id,
        //name: user.name,
        username: user.username,
        //email: user.email,
        //phone: user.phone,
        role: {id: user.role.id, name: user.role.name, childRoles: user.role.childRoles},
        groups: user.groups.map(g => {
            id: g.id
        }),
        //avatarurl: user.avatarurl,
        idSession: sessionId
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
                let decodedPassword = decodePassword(password)
                if (bcryptjs.compareSync(decodedPassword, user.password)) {
                    createSession(user, req).then(async session => {

                        //TOKEN
                        let {token, payload, options} = generateToken(user, session.id)

                        //REFRESH TOKEN
                        let refreshToken = generateRefreshToken(session.id)
                        //TODO recorrer y eliminar refreshToken expirados
                        /*
                        let now = new Date()
                        for(let rf of user.refreshToken){
                            let expiryDate = new Date(parseInt(rf.expiryDate))
                            if(now > expiryDate){
                                user.refreshToken.pull(rf)
                            }
                        }
                        */

                        user.refreshToken.push(refreshToken)
                        await user.save()


                        winston.info('AuthService.auth successful by ' + user.username)
                        resolve({token, payload, options, refreshToken})

                    }).catch(err => {
                        winston.error('AuthService.auth.createSession ', err)
                        reject(err)
                    })

                } else {
                    winston.warn('AuthService.auth: BadCredentials => ' + username)
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

export const refreshAuth = function (refreshTokenId) {

    return new Promise(async (resolve, reject) => {

        let user = await findUserByRefreshToken(refreshTokenId)


        let sessionId
        for (let refreshToken of user.refreshToken) {
            if (refreshToken.id === refreshTokenId) {
                sessionId = refreshTokenId.sessionId
                break
            }
        }

        if (user) {
            let {token} = generateToken(user, sessionId)
            return resolve(token)

        } else {
            return reject("No valida")
        }
    })
}

const generateToken = (user, sessionId) => {
    const payload = tokenSignPayload(user, sessionId)

    const options = {
        expiresIn: process.env.JWT_LOGIN_EXPIRED_IN || '1h',
        jwtid: user.id
    }

    let token = jsonwebtoken.sign(
        payload,
        process.env.JWT_SECRET,
        options
    )

    return {token, payload, options}
}

const generateRefreshToken = (sessionId) => {
    let expiredAt = new Date();
    const DEFAULT_REFRESHTOKEN_EXPIRED_IN = 24
    expiredAt.setHours(
        process.env.JWT_REFRESHTOKEN_EXPIRED_IN ? expiredAt.getHours() + parseInt(process.env.JWT_REFRESHTOKEN_EXPIRED_IN) : expiredAt.getHours() + DEFAULT_REFRESHTOKEN_EXPIRED_IN
    );

    let refreshToken = {
        id: uuidv4(),
        expiryDate: expiredAt.getTime(),
        sessionId: sessionId
    }

    return refreshToken
}

