import {DefaultLogger as winston} from '@dracul/logger-backend';
import bcryptjs from "bcryptjs";
import {createSession} from "./SessionService";
import jsonwebtoken from "jsonwebtoken";
import {createLoginFail} from "./LoginFailService";
import {findUser, findUserByRefreshToken, findUserByUsername, updateUser} from "./UserService";
import {decodePassword} from "./PasswordService"
import dayjs from 'dayjs'
import { checkIfUserIsInLDAP, getUserInfoFromLDAP } from './ldapService';
import { registerUser } from './RegisterService';

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
    let decodedPassword = decodePassword(password)

    if(useLDAP){
        try {
            userExistsInLDAP = await checkIfUserIsInLDAP(username)
        } catch (error) {
            reject(`error while checking user in ldap: '${error}'`)
        }
    }

    return new Promise((resolve, reject) => {
        function loginAs(user){
            if (bcryptjs.compareSync(decodedPassword, user.password)) {

                createSession(user, req).then(async session => {
                    let {token, payload, options} = generateToken(user, session.id)

                    if(user.refreshToken && user.refreshToken.length > 0){
                        const now = new Date()
                        const refreshTokensToDelete = user.refreshToken.filter(rf => {
                            const expiryDate = new Date(rf.expiryDate)
                            return (now > expiryDate) ? true: false
                        })
                        for(let refreshToken of refreshTokensToDelete){
                            user.refreshToken.pull(refreshToken)
                        }
                    }

                    //AGREGAMOS NUEVO REFRESH TOKEN
                    const refreshToken = generateRefreshToken(session.id)
                    if(!user.refreshToken){
                        user.refreshToken = []
                    }

                    user.refreshToken.push(refreshToken)
                    await user.save()

                    winston.info('AuthService.auth successful by ' + user.username)
                    resolve({token, payload, options, refreshToken, useLDAP})

                }).catch(error => {
                    winston.error('AuthService.auth.createSession ', error)
                    reject(error)
                })

            } else {
                winston.warn('AuthService.auth: BadCredentials => ' + username)
                createLoginFail(username, req)
                reject('BadCredentials')
            }
        }

        findUserByUsername(username).then(async (user) => {
            if (user && user.active === false) {
                winston.warn('AuthService.auth: DisabledUser => ' + username)
                reject('DisabledUser')
            }else if (user){
                loginAs(user)
            }

            if(useLDAP && userExistsInLDAP && !user){
                const userInfo = await getUserInfoFromLDAP(username)
                const name = username
                const fromLDAP = true

                let email, password

                for (const key in userInfo.attributes) {
                    switch (userInfo.attributes[key].type) {
                        case 'mail':
                            email = userInfo.attributes[key].vals[0]
                            break;
                        case 'userPassword':
                            password = userInfo.attributes[key].vals[0]
                            if(password !== decodedPassword){
                                reject(`Wrong credentials: '${password}' vs '${decodedPassword}'`)
                            }

                            break;
                    }
                }
                
                if(name && username && email && password){
                    try {
                        await registerUser({username, password, name, email, fromLDAP})
                        findUserByUsername(username).then(newUserFromLDAP => loginAs(newUserFromLDAP))
                    } catch (error) {
                        reject(`error when trying to register user that exists in ${process.env.LDAP_IP}'s LDAP ${error}`)
                    }
                }else{
                    reject(`The User's entry in LDAP does not have the required info`)
                }
                
                
            }else if(!user){
                winston.error(`AuthService.auth: UserDoesntExist => ${username}`)
                reject('UserDoesntExist')
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

        }catch (error) { () => reject(error) }
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
