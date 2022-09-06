import {DefaultLogger, DefaultLogger as winston} from '@dracul/logger-backend';
import {fetchSettings, SettingCache} from '@dracul/settings-backend';

const ldap = require('ldapjs')


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

        const ldapIP = await SettingCache('ldapIP')
        const ldapAdmin = adminUser ? adminUser : await SettingCache('ldapAdmin')
        const ldapPass = adminPass ? adminPass : await SettingCache('ldapPass')

        const ldapClient = await connectToLDAP(ldapIP)

        try {
            ldapClient.bind(
                `cn=${ldapAdmin}, dc=snd, dc=int`,
                ldapPass,
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

function mapLdapAttributesToUserObject(entry){

    let obj = {}

    for (const attribute of entry.attributes) {
        switch (attribute.type) {
            case "cn":
                obj.username = attribute.vals[0]
                obj.name = attribute.vals[0]
                break;
            case "mail":
                obj.email = attribute.vals[0]
                break;
            case "userPassword":
                obj.password = attribute.vals[0]
                break;
            case "gidNumber":
                obj.groupId = attribute.vals[0]
                break;
        }
    }

    return obj

}

function searchUserInLdap(username) {
    return new Promise(async (resolve, reject) => {

        let ldapClient = await loginAsAdmin()

        ldapClient.search(`cn=${username},ou=People,dc=snd,dc=int`, {}, (error, response) => {
                    if (error) return reject(error)

                    response.on('searchEntry', (entry) => resolve(entry))
                    response.on('error', () => reject('LDAP user not found'))
                })
    })
}

async function authLdapAndGetUserInfo(username, decodedPassword) {
    const entry = await searchUserInLdap(username)
    const userInfo = mapLdapAttributesToUserObject(entry)

    if(userInfo.password === decodedPassword){
        return Promise.resolve(userInfo)
    }else{
        return Promise.reject('LdapInvalidCredentials')
    }
}

module.exports = {
    authLdapAndGetUserInfo,
    searchUserInLdap,
    connectToLDAP,
    loginAsAdmin,
    mapLdapAttributesToUserObject
}
