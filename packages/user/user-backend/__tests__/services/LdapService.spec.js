//Utils
import {
    authLdapAndGetUserInfo,
    connectToLDAP,
    mapLdapAttributesToUserObject,
    searchUserInLdap, loginAsAdmin
} from "../../src/services/ldapService";
const mongoHandler = require('../utils/mongo-handler');

//Init DB
import {initPermissions, initAdminRole, initRootUser} from "../../src/services/InitService";

import {initializeSettings, SettingCache} from "@dracul/settings-backend";
import {LDAP_SETTINGS_TEST} from "../data/settings.data";

describe("LdapService", () => {

    beforeAll(async () => {
        await mongoHandler.connect()
        await initPermissions()
        await initAdminRole()
        await initRootUser()
        await initializeSettings(LDAP_SETTINGS_TEST)
    });

    afterAll(async () => {
        await mongoHandler.clearDatabase();
        await mongoHandler.closeDatabase();
    })

    test('LDAP SETTINGS', async (done) => {
       let ldapIP = await SettingCache('ldapIP')
        expect(ldapIP).toBe('192.168.10.39')
        done()
    })

    test('Connection to LDAP', async (done) => {

        const LDAP_IP = await SettingCache('ldapIP')

        let ldapClient = await connectToLDAP(LDAP_IP)

        expect(ldapClient.connected).toBe(true)

        done()

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

        console.log("entry",entry)

        let userInfo = mapLdapAttributesToUserObject(entry)

        console.log("userInfo",userInfo)

        await expect(userInfo).toBeInstanceOf(Object)
       // await expect(userInfo).toBeInstanceOf('SearchEntry')
       // await expect(userInfo.username).toBeInstanceOf(String)
        await expect(userInfo.username).toBe('refact')
        await expect(userInfo.email).toBe('refact@refact.com')
        await expect(userInfo.password).toBe('refact')
        await expect(userInfo.groupId).toBe('10000')

        //await expect(userInfo.groupName).toBe('Desarrollo')

    }, 2000);


    test('Auth Ldap real ok', async () => {
        let user = {username: 'refact', password: 'refact'}

        let userInfo = await authLdapAndGetUserInfo(user.username, user.password)

        await expect(userInfo).toBeInstanceOf(Object)
        await expect(userInfo.username).toBe('refact')
        await expect(userInfo.email).toBe('refact@refact.com')
        await expect(userInfo.password).toBe('refact')
        await expect(userInfo.groupId).toBe('10000')
        //await expect(userInfo.groupName).toBeInstanceOf('Desarrollo')

    }, 2000);

    test('Auth Ldap real fail', async () => {
        let user = {username: 'refact', password: 'asdasd'}

       await expect(authLdapAndGetUserInfo(user.username, user.password)).rejects.toMatch('LdapInvalidCredentials')


    }, 2000);




})

