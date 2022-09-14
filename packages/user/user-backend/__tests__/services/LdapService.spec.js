//Utils
import {
    authLdapAndGetUser,
    connectToLDAP,
    mapLdapAttributesToUserObject,
    searchUserInLdap, loginAsAdmin, getLdapVar
} from "../../src/services/LdapService";
const mongoHandler = require('../utils/mongo-handler');

//Init DB
import {
    initPermissions,
    initAdminRole,
    initSupervisorRole,
    initRootUser,
    initRoles,
} from "../../src/services/InitService";

import {initializeSettings} from "@dracul/settings-backend";
import {LDAP_SETTINGS_TEST} from "../data/settings.data";
import {DESARROLLO_ROLE} from "../data/roles.data";

describe("LdapService", () => {

    beforeAll(async () => {
        await mongoHandler.connect()
        await initPermissions()
        await initAdminRole()
        await initSupervisorRole()
        await initRootUser()
        await initRoles([DESARROLLO_ROLE])
        await initializeSettings(LDAP_SETTINGS_TEST)
        console.log("SETUP DONE")
    });

    afterAll(async () => {
        await mongoHandler.clearDatabase();
        await mongoHandler.closeDatabase();
    })

    test('LDAP SETTINGS', async (done) => {
       let ldapIP = await getLdapVar('LDAP_IP')
        expect(ldapIP).toBe('192.168.10.39')

        let ldapDn = await getLdapVar('LDAP_DN')
        expect(ldapDn).toBe('dc=snd,dc=int')

        done()
    })

    test('Connection to LDAP', async (done) => {

        const LDAP_IP = await getLdapVar('LDAP_IP')

        let ldapClient = await connectToLDAP(LDAP_IP)

        expect(ldapClient.connected).toBe(true)

        done()

    }, 2000);

    test('LDAP Login as Admin ok', async () => {

        const adminUser = await getLdapVar('LDAP_ADMIN_NAME')
        const adminPass = await getLdapVar('LDAP_ADMIN_PASS')
        await expect(loginAsAdmin(adminUser,adminPass)).resolves.toBeDefined()

    }, 2000);


    test('LDAP Login as Admin fail with bad credentials', async () => {

        await expect(loginAsAdmin('sarasa','sarasa')).rejects.toMatch('Invalid Credentials');

    }, 2000);


    test('LDAP Login as Admin fail with number credentials', async () => {

        await expect(loginAsAdmin(123123,123123)).rejects.toMatch('credentials (string) is required');

    }, 2000);


    test('Search user in LDAP', async () => {
        let user = {username: 'refact', password: 'refact'}
        let entry = await searchUserInLdap(user.username)
        let userInfo = mapLdapAttributesToUserObject(entry)
        
        console.log("entry",entry)
        console.log("userInfo",userInfo)

        await expect(userInfo).toBeInstanceOf(Object)
        await expect(userInfo.username).toBe('refact')
        await expect(userInfo.email).toBe('refact@refact.com')
        await expect(userInfo.password).toBe('refact')
        await expect(userInfo.groupId).toBe('10000')
    }, 2000);


    test('Auth Ldap real ok', async () => {
        let credentials = {username: 'refact', password: 'refact'}
        let user = await authLdapAndGetUser(credentials.username, credentials.password)

        console.log(`testing user ldap auth with the following user: '${user}'`)

        await expect(user).toBeInstanceOf(Object)
        await expect(user.username).toBe('refact')
        await expect(user.email).toBe('refact@refact.com')
        await expect(user.role.name).toBe('Desarrollo')

    }, 2000);

    test('Auth Ldap real fail', async () => {
        let user = {username: 'refact', password: 'asdasd'}

        await expect(authLdapAndGetUser(user.username, user.password)).rejects.toThrowError('LdapInvalidCredentials')
    }, 2000);

    test(`Establishing user role by LDAP's user group`, async () => {
        const credentials1 = {
            username: 'refact2',
            password: 'refact2',
        }

        const credentials2 = {
            username: 'test',
            password: 'test',
        }

        const supervisorUser = await authLdapAndGetUser(credentials1.username, credentials1.password)
        await expect(supervisorUser.role.name).toBe('supervisor')

        const desarrolladorUser = await authLdapAndGetUser(credentials2.username, credentials2.password)
        await expect(desarrolladorUser.role.name).toBe('Desarrollo')

    }, 2000)

    
})

