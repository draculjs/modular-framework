import {DefaultLogger as winston} from '@dracul/logger-backend';
import bcryptjs from "bcryptjs";
import {createSession} from "./SessionService";
import jsonwebtoken from "jsonwebtoken";
import {createLoginFail} from "./LoginFailService";
import {findUser, findUserByRefreshToken, findUserByUsername} from "./UserService";
import {decodePassword} from "./PasswordService"
import dayjs from 'dayjs'
import {authLdapAndGetUser, isLdapAuthEnable} from './LdapService';

const {v4: uuidv4} = require('uuid');

export const auth = function ({username, password}, req) {

    return new Promise(async (resolve, reject) => {
        let user = null
        let decodedPassword = decodePassword(password)

        if (await isLdapAuthEnable()) {
            try {
                const user = await authLdapAndGetUser(username, decodedPassword)

                if (!user) {
                    winston.error('No se pudo obtener ni crear el usuario local para LDAP')
                }

            } catch (error) {
                winston.error('LDAP AUTH ERROR ' + error)
            }
        }

        if (!user) {

            user = await findUserByUsername(username)

            //Si obtuve usuario chequeo la password
            if (user && !checkPassword(decodedPassword, user.password)) {
                winston.warn('AuthService.auth: BadCredentials => ' + username)
                createLoginFail(username, req)
                return reject('BadCredentials')
            }
        }

        if (!user) {
            winston.warn('AuthService.auth: UserDoesntExist => ' + username)
            return reject('UserDoesntExist')

        } else if (user && user.active === false) {
            winston.warn('AuthService.auth: DisabledUser => ' + username)
            return reject('DisabledUser')
        }


        try {
            const session = await createSession(user, req)

            let {token, payload, options} = generateToken(user, session.id)
            const refreshToken = await updateRefreshToken(user, session);

            winston.info('AuthService.auth successful by ' + user.username)
            return resolve({token, payload, options, refreshToken})

        } catch (error) {
            winston.error('AuthService.auth.createSession ', error)
            return reject(error)
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

function checkPassword(decodedPassword, userPassword) {
    return bcryptjs.compareSync(decodedPassword, userPassword);
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
