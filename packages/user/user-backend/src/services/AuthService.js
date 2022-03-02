import {DefaultLogger as winston} from '@dracul/logger-backend';
import bcryptjs from "bcryptjs";
import {createSession} from "./SessionService";
import jsonwebtoken from "jsonwebtoken";
import {createLoginFail} from "./LoginFailService";
import {findUser, findUserByRefreshToken, findUserByUsername, updateUser} from "./UserService";
import {decodePassword} from "./PasswordService"
const { v4: uuidv4 } = require('uuid');


export const tokenSignPayload = function (user, session) {
    return {
        id: user.id,
        //name: user.name,
        username: user.username,
        //email: user.email,
        //phone: user.phone,
        role: {id: user.role.id, name: user.role.name, childRoles: user.role.childRoles},
        groups: user.groups.map(g => {id: g.id}),
        //avatarurl: user.avatarurl,
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
                let decodedPassword = decodePassword(password)
                if (bcryptjs.compareSync(decodedPassword, user.password)) {
                    createSession(user, req).then(async session => {
                        let { token, payload, options } = generateToken(user, session)
                        let userToUpdate = await findUser(user.id)
                        let refreshToken = generateRefreshToken()

                        userToUpdate.refreshToken = userToUpdate.refreshToken.map((token)=>{
                            if(token.expiryDate > Date.now()) return token
                        })
                        userToUpdate.refreshToken = userToUpdate.refreshToken.push(refreshToken)
                        updateUser(user.id, userToUpdate)

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

export const refreshAuth = function(refreshToken, expiryDate, req) {
    return new Promise(async (resolve, reject) => {
        let user = await findUserByRefreshToken(refreshToken, expiryDate)

        if (validateUserForRefresh(user)) {
            createSession(user, req).then(async session => {
                let { token } = generateToken(user, session)
                return resolve(token)
            })
        } else {
            return reject("No valida")
        }
    })
}

const generateToken = (user, session) => {
    const payload = tokenSignPayload(user, session)

    const options = {
        expiresIn: process.env.JWT_LOGIN_EXPIRED_IN || '1h',
        jwtid: user.id
    }

    let token = jsonwebtoken.sign(
        payload,
        process.env.JWT_SECRET,
        options
    )

    return { token, payload, options }
}

const generateRefreshToken = () => {
    let expiredAt = new Date();
    expiredAt.setHours(
        process.env.REFRESHTOKEN_EXPIRED ? expiredAt.getHours() + process.env.REFRESHTOKEN_EXPIRED : expiredAt.getHours() + 24
    );
    let uuidToken = uuidv4()

    let refreshToken = {
      token: uuidToken,
      expiryDate: expiredAt.getTime()
    }

    return refreshToken
}

const validateUserForRefresh = (user) => {
    if (!user.active) throw new Error("Inactive user")
    if (!user.refreshToken.token) throw new Error("User refresh token is undefined")
    if (user.refreshToken.expiryDate.getTime() < new Date().getTime()) throw new Error("Token is expired")
    return true
}