import {DefaultLogger as winston} from '@dracul/logger-backend';
import {fetchSettings} from '@dracul/settings-backend';

const ldap = require('ldapjs')

function getLdapSettings(){
  return new Promise((resolve, reject) => {

    fetchSettings().then(response => {
      let ldapIP, ldapAdmin, ldapPass
  
      for (const index in response) {
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
  
    resolve({ldapIP, ldapAdmin, ldapPass})
  
    }).catch(error => {
      winston.error(`Error while trying to fetch LDAP settings: '${error}'`)
      reject(error)
    })
  })

}

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

    getLdapSettings().then(({ldapIP, ldapAdmin, ldapPass} ) => {

        connectToLDAP(ldapIP).then(
          function onSuccess(client){
            try {
              client.bind(`cn=${ldapAdmin}, dc=snd, dc=int`, `${ldapPass}`, (error) => {
                return error ? reject(error) : resolve(client)
              })

            } catch (error) {
              winston.error(`Error while trying to authenticate in ldap (bind): '${error}'`)
              reject(error)
            }
          },

          function onError(error){ 
            reject(error)
          }
        )
    })
  })
}

async function checkIfUserIsInLdap(username){
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
  }).then((result) => result).catch(error => winston.error(`error when trying to get user info from LDAP: '${error}'`))
}

async function getLdapUserRegisterInfo(username, decodedPassword){
  const userInfo = await getUserInfoFromLDAP(username)
  const userInfoNeededForRegister = {}

  userInfoNeededForRegister.username = username
  userInfoNeededForRegister.name = username
  userInfoNeededForRegister.fromLDAP = true 

  for (const key in userInfo.attributes) {
    switch (userInfo.attributes[key].type) {
      case "mail":
        userInfoNeededForRegister.email = userInfo.attributes[key].vals[0]
        break;
      case "userPassword":
        const userPassFromLDAP = userInfo.attributes[key].vals[0]

        if (userPassFromLDAP !== decodedPassword) {
          reject(
            `Wrong credentials: '${userPassFromLDAP}' vs '${decodedPassword}'`
          );
        }

        userInfoNeededForRegister.password = userPassFromLDAP
        break;
    }
  }

  const succesfullyGotUserInfo =  userInfoNeededForRegister.name && userInfoNeededForRegister.username && userInfoNeededForRegister.email && userInfoNeededForRegister.password
  if(succesfullyGotUserInfo) return userInfoNeededForRegister

  throw new Error(`The User's entry in LDAP does not have the required info`)
}

module.exports = {checkIfUserIsInLdap, getUserInfoFromLDAP, getLdapUserRegisterInfo}