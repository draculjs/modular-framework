import {DefaultLogger as winston} from '@dracul/logger-backend';
import bcryptjs from "bcryptjs";
import {createSession} from "./SessionService";
import jsonwebtoken from "jsonwebtoken";
import {createLoginFail} from "./LoginFailService";
import {findUser, findUserByRefreshToken, findUserByUsername, updateUser} from "./UserService";
import {decodePassword} from "./PasswordService"
import dayjs from 'dayjs'
import { checkIfUserIsInLDAP, getUserInfoFromLDAP } from './ldapService';
// import { registerUser } from './RegisterService';

const {v4: uuidv4} = require('uuid');


export const tokenSignPayload = function (user, sessionId) {
    return {
        id: user.id,
        username: user.username,
        role: {id: user.role.id, name: user.role.name, childRoles: user.role.childRoles},
        groups: user.groups.map(g => {
            id: g.id
        }),
        idSession: sessionId
    };
}


export const auth = async function ({username, password, useLDAP}, req) {
    let userExistsInLDAP

    if(useLDAP){
        userExistsInLDAP = await checkIfUserIsInLDAP(username)
        console.log(userExistsInLDAP)
    }

    return new Promise((resolve, reject) => {
        findUserByUsername(username).then(user => {

            if (!user && useLDAP && userExistsInLDAP) { //conseguir info de ldap para registrar al usuario en db de dracul
                const userInfo = getUserInfoFromLDAP(username)
                console.log(`LDAP userInfo: ${userInfo}`)
                // await registerUser()
                
            }else if(!user){
                winston.warn('AuthService.auth: UserDoesntExist => ' + username)
                reject('UserDoesntExist')
            }

            if (user && user.active === false) {
                winston.warn('AuthService.auth: DisabledUser => ' + username)
                reject('DisabledUser')
            }

            if (user) { //Already is in local DB
                let decodedPassword = decodePassword(password)

                if (useLDAP && !userExistsInLDAP){
                    winston.warn(username + 'is not registered in LDAP')
                    reject('User is not in LDAP')
                }

                if (bcryptjs.compareSync(decodedPassword, user.password)) {

                    createSession(user, req).then(async session => {

                        //GENERAMOS ACCESS TOKEN
                        let {token, payload, options} = generateToken(user, session.id)

                        //ELIMINAMOS REFRESHTOKENS CADUCADOS
                        if(user.refreshToken && user.refreshToken.length > 0){
                            let now = new Date()
                            let refreshTokenToDelete = user.refreshToken.filter(rf => {
                                let expiryDate = new Date(rf.expiryDate)
                                return (now > expiryDate) ? true: false
                            })
                            for(let rf of refreshTokenToDelete){
                                user.refreshToken.pull(rf)
                            }
                        }


                        //AGREGAMOS NUEVO REFRESH TOKEN
                        let refreshToken = generateRefreshToken(session.id)
                        if(!user.refreshToken){
                            user.refreshToken = []
                        }
                        user.refreshToken.push(refreshToken)
                        await user.save()


                        winston.info('AuthService.auth successful by ' + user.username)
                        resolve({token, payload, options, refreshToken, useLDAP})

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

        try{
            let user = await findUserByRefreshToken(refreshTokenId)

            if (user) {
                let sessionId
                for (let refreshToken of user.refreshToken) {
                    if (refreshToken.id === refreshTokenId) {
                        sessionId = refreshToken.sessionId
                        break
                    }
                }

                let {token} = generateToken(user, sessionId)
                return resolve(token)

            } else {
                return reject(new Error("Invalid RefreshToken"))
            }

        }catch (error) {
            return reject(error)
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

export const generateRefreshToken = (sessionId) => {

    const DEFAULT_REFRESHTOKEN_EXPIRED_IN = '24h'
    const duration = process.env.JWT_REFRESHTOKEN_EXPIRED_IN || DEFAULT_REFRESHTOKEN_EXPIRED_IN

    if (!/[0-9]+[dwMyhms(ms)]/.test(duration)) {
        throw new Error("JWT_REFRESHTOKEN_EXPIRED_IN invalid format /[0-9]+[dwMyhms(ms)/")
    }

    let number = duration.match(/[0-9]+/)[0]
    let unit = duration.match(/[dwMyhms(ms)]/)[0]

    let expiredAt = dayjs().add(number, unit)

    let refreshToken = {
        id: uuidv4(),
        expiryDate: expiredAt.valueOf(),
        sessionId: sessionId
    }

    return refreshToken
}
