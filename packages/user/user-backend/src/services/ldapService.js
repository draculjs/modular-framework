const ldap = require('ldapjs');

function connectToLDAP(ip){
    let connectionResult
    let developmentLDAPConnection
  
    return new Promise((resolve, reject) => {
      developmentLDAPConnection = ldap.createClient({
        url: `ldap://${ip}:389`,
        connectTimeout: 2000
      })
      
      developmentLDAPConnection.on('connect', () =>{
        resolve('connected')
      })
  
      developmentLDAPConnection.on('error', () =>{
        reject('error')
      })
    }).then(
      function isResolved(result){
        connectionResult = result
  
        return {
          connectionResult: connectionResult,
          client: developmentLDAPConnection
        }
      },

      function isRejected(error){
        connectionResult = error
  
        return {
          connectionResult,
        }
      }
    )
}

async function loginAsAdmin(){
  const client = (await connectToLDAP(process.env.LDAP_IP)).client

  try {
    await client.bind(`cn=${process.env.LDAP_ADMIN_NAME}, dc=snd, dc=int`, `${process.env.LDAP_ADMIN_PASS}`)
    return client;
} catch (error) {
    console.error(`ERROR WHEN TRYING TO LOG IN LDAP AS ADMIN: '${error}'`)
  }
}

async function checkIfUserIsInLDAP(username){
    return new Promise((resolve, reject) => {
      const client = await loginAsAdmin()

      client.search(`cn=${username},ou=People,dc=snd,dc=int`, {}, (error, response) => {
        if (error) reject(error)
    
        response.on('searchEntry', () =>{
          resolve(true)
        })

        response.on('error', () => {
          resolve(false)
        })
      })

    }).then((result) => console.log(result)).catch(error => console.error(error))
}

async function getUserInfoFromLDAP(username){
  return new Promise((resolve, reject) => {
    const client = await loginAsAdmin()

    client.search(`cn=${username},ou=People,dc=snd,dc=int`, {}, (error, response) => {
      if (error) reject(error)
  
      response.on('searchEntry', (entry) =>{
        resolve(entry)
      })

      response.on('error', () => {
        reject('No entries were found!')
      })
    })

  }).then((result) => console.log(result)).catch(error => console.error(error))
}

async function createUserInLDAP(username, password){
  const {createHash} = require("crypto")
  const client = await loginAsAdmin()

  const userEntry = {
    uid: uuidv4(),
    cn: `${username}`,
    sn: `${username}`,
    homeDirectory: `/home/${username}`,
    objectClass: 'inetOrgPerson',
    userPassword: createHash('sha256').update(password)
  }

  try {
    client.add(`cn=${username}, ou=People,dc=snd,dc=int`, userEntry)
  } catch (error) {
    console.error(`ERROR WHEN TRYING TO ADD USER TO LDAP: '${error}'`)
  }

}

module.exports = {checkIfUserIsInLDAP, createUserInLDAP, getUserInfoFromLDAP}