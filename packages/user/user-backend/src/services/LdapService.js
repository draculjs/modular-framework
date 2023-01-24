import {DefaultLogger, DefaultLogger as winston} from '@dracul/logger-backend';
import {SettingCache} from '@dracul/settings-backend';
import {createUser, findUserByUsername} from "./UserService";
import {findRoleByName} from "./RoleService";

const ldap = require('ldapjs')

async function isLdapAuthEnabled(){
    try {
        const LDAP_AUTH_SETTING = await getLdapVar('LDAP_AUTH')
        const LDAP_IP = await getLdapVar('LDAP_IP')

        if((LDAP_AUTH_SETTING === 'enable' && LDAP_IP)){
            return true
        }else{
            return false
        }

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

        } else if(!ldapVariable && !process.env[varName]){
            return null

        } else return ldapVariable


    } catch (error) {
        winston.error(error)
        throw new Error(error)
    }
}


function connectToLDAP(ip, port = '389') {
    if (!ip) throw new Error('LDAP IP not found')
        
    return new Promise((resolve, reject) => {
        let ldapClient

        ldapClient = ldap.createClient({
            url: `ldap://${ip}:${port}`,
            connectTimeout: 1500
        })

        ldapClient.on('connect', () => {
            return resolve(ldapClient)
        })

        ldapClient.on('error', (error) => {
            return reject(error)
        })
    })
}

function loginInLdap(user, pass, asAdmin = false) {
    return new Promise(async (resolve, reject) => {
        try {
            const LDAP_IP = await getLdapVar('LDAP_IP')
            const LDAP_DN = await getLdapVar('LDAP_DN')
            const LDAP_OU = await getLdapVar('LDAP_OU')

            const ldapClient = await connectToLDAP(LDAP_IP)
            const bindLogin = asAdmin ? `cn=${user}, ${LDAP_DN}` : `cn=${user}, ou=${LDAP_OU}, ${LDAP_DN}`

            ldapClient.bind(
                bindLogin,
                pass,
                error => {
                    if (error) {
                        DefaultLogger.warn(`LDAP login failed for user: '${user}'`)
                        DefaultLogger.error(`Error while trying to authenticate in ldap (bind): '${error}'`);
                        reject(error.message)
                    }else{
                        resolve(ldapClient);
                    }
                }
            )
        } catch (error) {
            reject(error.message + "in LOGINLDAP")
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

function searchUserInLdap(username, ldapClient) {
    return new Promise(async (resolve, reject) => {
        try {
            const LDAP_DN = await getLdapVar('LDAP_DN')
            const LDAP_OU = await getLdapVar('LDAP_OU')

            ldapClient.search(`cn=${username}, ou=${LDAP_OU}, ${LDAP_DN}`, {}, (error, response) => {
                if (error) reject(`error in searchUserInLdap: "${error}"`)

                response.on('searchEntry', (entry) => resolve(entry))
                response.on('error', () => reject('LDAP user not found'))
            })
        } catch (error) {
            DefaultLogger.error(`error at searchUserInLdap(): '${error}'`)
        }
    })
}

function searchUserGroup(user, pass, groupId) {
    return new Promise(async (resolve, reject) => {
        const ldapClient = await loginInLdap(user, pass)
        const LDAP_DN = await getLdapVar('LDAP_DN')

        const options = {
            scope: 'sub',
            attributes: ['cn', 'gidNumber'],
            filter : `(gidNumber=${groupId})`
        }

        ldapClient.search(`ou=group, ${LDAP_DN}`, options, (error, response) => {
            if (error) reject(`error while triying to searchUserGroup: '${error}'`)

            response.on('searchEntry', (entry) => resolve(entry.attributes[1].vals[0]))
            response.on('error', () => reject('LDAP groups not found'))
        })
    })
}


async function getLocalUserOrCreate(userLdapInfo) {
    if (!userLdapInfo.username && !userLdapInfo.password) throw new Error(`UserLdapInfoRequired`)
    if (!userLdapInfo.email) userLdapInfo.email = userLdapInfo.username + '@dracul.int'

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
            userLdapInfo.fromLDAP = true

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
        const ldapClient = await loginInLdap(username, decodedPassword)
        const entry = await searchUserInLdap(username, ldapClient)

        const userInfo = mapLdapAttributesToUserObject(entry)
        const groupName = await searchUserGroup(username, decodedPassword, userInfo.groupId)

        userInfo.groupName = groupName

        const user = await getLocalUserOrCreate(userInfo)
        return user

    }catch (error) {
        const message = error.message ? error.message : error.toString()
        throw new Error(message)
    }

}

module.exports = {
    isLdapAuthEnabled,
    getLdapVar,
    authLdapAndGetUser,
    searchUserInLdap,
    connectToLDAP,
    loginInLdap,
    mapLdapAttributesToUserObject
}
