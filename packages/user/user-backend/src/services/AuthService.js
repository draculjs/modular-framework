import {DefaultLogger as winston} from '@dracul/logger-backend';
import bcryptjs from "bcryptjs";
import {createSession} from "./SessionService";
import jsonwebtoken from "jsonwebtoken";
import {createLoginFail} from "./LoginFailService";
import {findUser, findUserByRefreshToken, findUserByUsername} from "./UserService";
import {decodePassword} from "./PasswordService"
import dayjs from 'dayjs'
import {authLdapAndGetUserInfo} from './ldapService';
import {registerUser} from './RegisterService';

const {v4: uuidv4} = require('uuid');

export const auth = function ({username, password}, req) {

    return new Promise(async (resolve, reject) => {
        const useLDAP = process.env.LDAP_AUTH && process.env.LDAP_AUTH.toLowerCase() === 'true'
        let decodedPassword = decodePassword(password)

        if (useLDAP) {
            try {
                const userLdapInfo = await authLdapAndGetUserInfo(username, decodedPassword)
                await createLdapUserIfItDoesntExists(userLdapInfo)
            } catch (error) {
              reject(`LdapUserDoesntExist or ${error}`)
            }
        }

        const user =  await findUserByUsername(username)

        if (!user) {
            winston.warn('AuthService.auth: UserDoesntExist => ' + username)
            reject('UserDoesntExist')

        } else if (user && user.active === false) {
            winston.warn('AuthService.auth: DisabledUser => ' + username)
            reject('DisabledUser')
        }

        //Chequeo de password si existe el usuario
        if (checkLocalPassword(decodedPassword, user.password)) {

            try {
                const session = await createSession(user, req = null)

                let {token, payload, options} = generateToken(user, session.id)
                const refreshToken = await updateRefreshToken(user, session);

                winston.info('AuthService.auth successful by ' + user.username)
                resolve({token, payload, options, refreshToken})

            } catch (error) {
                winston.error('AuthService.auth.createSession ', error)
                reject(error)
            }


        } else {
            winston.warn('AuthService.auth: BadCredentials => ' + username)

            createLoginFail(username, req)
            reject('BadCredentials')
        }
    })
}

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


async function updateRefreshToken(user, session) {
    if (user.refreshToken && user.refreshToken.length > 0) {
        const now = new Date()
        const refreshTokensToDelete = user.refreshToken.filter(rf => {
            const expiryDate = new Date(rf.expiryDate)
            return (now > expiryDate) ? true : false
        })
        for (let refreshToken of refreshTokensToDelete) {
            user.refreshToken.pull(refreshToken)
        }
    }

    //AGREGAMOS NUEVO REFRESH TOKEN
    const refreshToken = generateRefreshToken(session.id)
    if (!user.refreshToken) {
        user.refreshToken = []
    }

    user.refreshToken.push(refreshToken)
    await user.save()
    return refreshToken;
}

function checkLocalPassword(decodedPassword, userPassword) {
    return bcryptjs.compareSync(decodedPassword, userPassword);
}

async function createLdapUserIfItDoesntExists(userLdapInfo){
    const user = await findUserByUsername(userLdapInfo.username)

    if (user) {
        try {
            registerUser(userLdapInfo)
        } catch (error) {
            winston.error(`Error while trying to register user: '${error}'`)
        }
    }
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
        try {
            const user = await findUserByRefreshToken(refreshTokenId)
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

        } catch (error) {
            () => reject(error)
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

    const refreshToken = {
        id: uuidv4(),
        expiryDate: expiredAt.valueOf(),
        sessionId: sessionId
    }

    return refreshToken
}
