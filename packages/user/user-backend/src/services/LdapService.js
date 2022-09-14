import {DefaultLogger, DefaultLogger as winston} from '@dracul/logger-backend';
import {SettingCache} from '@dracul/settings-backend';
import {createUser, findUserByUsername} from "./UserService";
import {findRoleByName} from "./RoleService";

const ldap = require('ldapjs')

async function isLdapAuthEnable(){
    try {
        const LDAP_AUTH_SETTING = await getLdapVar('LDAP_AUTH')
        const LDAP_IP = await getLdapVar('LDAP_IP')
        const LDAP_AUTH = LDAP_AUTH_SETTING ? LDAP_AUTH_SETTING : (process.env.LDAP_AUTH && process.env.LDAP_AUTH.toLowerCase() === 'true')
        
        return (LDAP_AUTH && LDAP_IP) ? LDAP_AUTH : false
    } catch (error) {
        winston.error(error)
    }
    
}

async function determineUserRoleByLdapGroup(groupName = null){
    if (!groupName){
        const LDAP_DEFAULT_ROLE = await getLdapVar('LDAP_DEFAULT_ROLE')
        return LDAP_DEFAULT_ROLE ? LDAP_DEFAULT_ROLE : 'operador'
    }

    return groupName
}

async function getLdapVar(varName){

    try {
        const ldapVariable = await SettingCache(varName)

        if(!ldapVariable && process.env[varName]){
            return process.env[varName]
        }
        
        if(!ldapVariable && !process.env[varName]){
            const error = `LDAP variable ${varName} not found`
            
            winston.error(error)
            throw new Error(error)
        }
    
        return ldapVariable
    } catch (error) {
        winston.error(error)
        throw new Error(error)
    }
}


function connectToLDAP(ip, port = '389') {

    return new Promise((resolve, reject) => {
        let ldapClient

        ldapClient = ldap.createClient({
            url: `ldap://${ip}:${port}`,
            connectTimeout: 2000
        })

        ldapClient.on('connect', () => {
            resolve(ldapClient)
        })

        ldapClient.on('error', (error) => {
            reject(error)
        })
    })
}

function loginAsAdmin(adminUser, adminPass) {

    return new Promise(async (resolve, reject) => {
        const LDAP_IP = await getLdapVar('LDAP_IP')
        const LDAP_ADMIN = adminUser ? adminUser : await getLdapVar('LDAP_ADMIN_NAME')
        const LDAP_PASS = adminPass ? adminPass : await getLdapVar('LDAP_ADMIN_PASS')
        const LDAP_DN = await getLdapVar('LDAP_DN')

        const ldapClient = await connectToLDAP(LDAP_IP)

        try {
            ldapClient.bind(
               // `cn=${LDAP_ADMIN}, dc=snd, dc=int`,
                `cn=${LDAP_ADMIN}, ${LDAP_DN}`,
                LDAP_PASS,
                error => {
                    if (error) {
                        DefaultLogger.error(`Error while trying to authenticate in ldap (bind): '${error}'`);
                        return reject(error.message)
                    }
                    return resolve(ldapClient);
                }
            )
        } catch (e) {
            return reject(e.message)
        }
    })

}

function mapLdapAttributesToUserObject(entry) {

    let object = {}

    for (const attribute of entry.attributes) {
        switch (attribute.type) {
            case "cn":
                object.username = attribute.vals[0]
                object.name = attribute.vals[0]
                break;
            case "mail":
                object.email = attribute.vals[0]
                break;
            case "userPassword":
                object.password = attribute.vals[0]
                break;
            case "gidNumber":
                object.groupId = attribute.vals[0]
                break;
        }
    }

    return object
}

function searchUserInLdap(username) {

    return new Promise(async (resolve, reject) => {
        const ldapClient = await loginAsAdmin()
        const LDAP_DN = await getLdapVar('LDAP_DN')
        const LDAP_OU = await getLdapVar('LDAP_OU')

        ldapClient.search(`cn=${username}, ou=${LDAP_OU}, ${LDAP_DN}`, {}, (error, response) => {
            if (error) return reject(error)

            response.on('searchEntry', (entry) => resolve(entry))
            response.on('error', () => reject('LDAP user not found'))
        })
    })
}

function searchUserGroup(groupId) {
    
    return new Promise(async (resolve, reject) => {
        const ldapClient = await loginAsAdmin()
        const LDAP_DN = await getLdapVar('LDAP_DN')

        const options = {
            scope: 'sub',
            attributes: ['cn', 'gidNumber'],
            filter : `(gidNumber=${groupId})`
        }

        ldapClient.search(`ou=group, ${LDAP_DN}`, options, (error, response) => {
            if (error) return reject(error)

            response.on('searchEntry', (entry) => resolve(entry.attributes[1].vals[0]))
            response.on('error', () => reject('LDAP groups not found'))
        })
    })
}


async function getLocalUserOrCreate(userLdapInfo) {
    const ldapInfoIsComplete = userLdapInfo.username && userLdapInfo.email && userLdapInfo.password
    if (!ldapInfoIsComplete) throw new Error(`UserLdapInfoRequired`)

    let user = await findUserByUsername(userLdapInfo.username)
    if (!user) {
        try {
            const ROLE_NAME = await determineUserRoleByLdapGroup(userLdapInfo.groupName)
            const role = await findRoleByName(ROLE_NAME)

            if (!role) {
                winston.error(`ROLE ${ROLE_NAME} not found `)
                throw new Error(`LDAP_ROLE "${ROLE_NAME}" doesn't exist`)
            }

            userLdapInfo.role = role
            userLdapInfo.active = true
            userLdapInfo.fromLdap = true

            console.log(`Info from ldap user: '${JSON.stringify(userLdapInfo)}'`)

            user = await createUser(userLdapInfo)
            return (user)

        } catch (error) {
            winston.error(`Error while trying to create user: '${error}'`)
            throw new Error(error.message)
        }
    }

    return user
}

async function authLdapAndGetUser(username, decodedPassword) {

    try{
        const entry = await searchUserInLdap(username)
        const userInfo = mapLdapAttributesToUserObject(entry)

        const groupName = await searchUserGroup(userInfo.groupId)
        userInfo.groupName = groupName

        console.log(userInfo)
        if (!userInfo) throw new Error('LdapUserDoesntExist')

        if (userInfo.password === decodedPassword) {
            const user = await getLocalUserOrCreate(userInfo)
            return user
        } else {
            winston.error(`passwords don't match '${userInfo.password}' vs '${decodedPassword}'`)
            throw new Error('LdapInvalidCredentials')
        }
    }catch (error) {
        const message = error.message ? error.message : error.toString()

        winston.error(`authLdapAndGetUser error: '${message}' `)
        throw new Error(message)
    }

}

module.exports = {
    isLdapAuthEnable,
    getLdapVar,
    authLdapAndGetUser,
    searchUserInLdap,
    connectToLDAP,
    loginAsAdmin,
    mapLdapAttributesToUserObject
}
