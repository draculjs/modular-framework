import {fetchSettings} from '@dracul/settings-backend'
const ldap = require('ldapjs');

let ldapIP, ldapAdmin, ldapPass

fetchSettings().then(response => {
    for (const index in response) {
        console.log(`RESPONSE #${index}: '${response[index]}'`)
        console.log(`RESPONSE #${index} key: '${response[index]['key']}'`)

        switch (response[index]['key']) {
          case "ldapIP":
            ldapIP = response[index]['value']

            break
          case "ldapAdmin":
            ldapAdmin = response[index]['value']

            break
          case "ldapPass":
            ldapPass = response[index]['value']

            break
        }
    }
}).catch(error => console.error(`ERROR AL FETCHEAR SETTINGS LPTM: '${error}'`))

function connectToLDAP(ip){
    let developmentLDAPConnection
  
    return new Promise((resolve, reject) => {
      developmentLDAPConnection = ldap.createClient({
        url: `ldap://${ip}:389`,
        connectTimeout: 2000
      })
      
      developmentLDAPConnection.on('connect', () =>{
        resolve('connected')
      })
  
      developmentLDAPConnection.on('error', (error) =>{
        reject(error)
      })
    }).then(
      function isResolved(){
        return developmentLDAPConnection
      },

      function isRejected(result){
        return result
      }
    )
}

function loginAsAdmin(){
  return new Promise((resolve, reject) => {
    connectToLDAP(process.env.LDAP_IP).then(
      function onSuccess(client){
        try {
          client.bind(`cn=${process.env.LDAP_ADMIN_NAME}, dc=snd, dc=int`, `${process.env.LDAP_ADMIN_PASS}`, (error) => {
            return error ? reject(error) : resolve(client)
          })

        } catch (error) {
          console.error(`Error while trying to authenticate in ldap (bind): '${error}'`)
          reject(error)
        }

      }
      ).catch(error => reject(error))
  })
}

async function checkIfUserIsInLDAP(username){
  return new Promise((resolve, reject) => {
    loginAsAdmin().then((client) => {
      client.search(`cn=${username},ou=People,dc=snd,dc=int`, {}, (error, response) => {
        if (error) reject(error)
    
        response.on('searchEntry', () =>{
          resolve(true)
        })

        response.on('error', () => {
          resolve(false)
        })
      })
    })
      
  }).then((result) => result).catch(error => console.error(error))
}

async function getUserInfoFromLDAP(username){
  return new Promise((resolve, reject) => {

    const client = loginAsAdmin().then((client) => {
      client.search(`cn=${username},ou=People,dc=snd,dc=int`, {}, (error, response) => {
        if (error) reject(error)
    
        response.on('searchEntry', (entry) =>{
          resolve(entry)
        })
  
        response.on('error', () => {
          reject('No entries were found!')
        })
      })
    })
  }).then((result) => result).catch(error => console.error(error))
}

module.exports = {checkIfUserIsInLDAP, getUserInfoFromLDAP}