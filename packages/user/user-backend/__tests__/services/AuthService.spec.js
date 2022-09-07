//Utils
import {initializeSettings} from "@dracul/settings-backend";

const mongoHandler = require('../utils/mongo-handler');

//Init DB
import {initPermissions, initAdminRole, initRootUser, initRoles} from "../../src/services/InitService";

//Service to Test

import {
    apiKey,
    auth
} from "../../src/services/AuthService";
import {encodePassword} from "../../src/services/PasswordService"
import {findUserByUsername} from "../../src/services/UserService";
import AuthResolvers from "../../src/graphql/resolvers/AuthResolvers"
import {LDAP_SETTINGS_TEST} from "../data/settings.data";
import {DESARROLLO_ROLE} from "../data/roles.data";

describe("UserService", () => {

    beforeAll(async () => {
        await mongoHandler.connect()
        await initPermissions()
        await initAdminRole()
        await initRootUser()
        await initRoles([DESARROLLO_ROLE])
        await initializeSettings(LDAP_SETTINGS_TEST)
    });

    afterAll(async () => {
        await mongoHandler.clearDatabase();
        await mongoHandler.closeDatabase();
    })

    test('Auth local ok with LDAP OFF', async (done) => {
        process.env.LDAP_AUTH = 'false'

        let user = {username: 'root', password: 'root.123'}
        user.password = encodePassword(user.password)

        let result = await auth(user, null)

        expect(result).toBeInstanceOf(Object)
        expect(!!result.payload).toBe(true)
        expect(!!result.refreshToken).toBe(true)
        done()

    }, 5000);

    test('Auth local ok with LDAP ON', async (done) => {
        process.env.LDAP_AUTH = 'true'

        let user = {username: 'root', password: 'root.123'}
        user.password = encodePassword(user.password)

        let result = await auth(user, null)

        expect(result).toBeInstanceOf(Object)
        expect(!!result.payload).toBe(true)
        expect(!!result.refreshToken).toBe(true)
        done()

    }, 5000);

    test('Auth local with check refresh token ok', async (done) => {
        process.env.LDAP_AUTH = 'false'
        let user = {username: 'root', password: 'root.123'}
        user.password = encodePassword(user.password)

        auth(user, null).then((res) => {

            setTimeout(async () => {
                let refreshToken = res.refreshToken
                let newToken = await AuthResolvers.Mutation.refreshToken(null,
                    {
                        refreshTokenId: refreshToken.id,
                    }, {req: null})

                expect(newToken.token).not.toBe( res.token)
                done()
            }, 2000)
        })

    }, 5000);


    test('Auth ldap ok (real ldap)', async (done) => {
        process.env.LDAP_AUTH = 'true'
        process.env.LDAP_ROLE = 'Desarrollo'
        process.env.LDAP_DN = 'dc=snd,dc=int'
        process.env.LDAP_OU = 'ou=People'

        let user = {username: 'refact', password: 'refact'}
        user.password = encodePassword(user.password)

        let result = await auth(user, undefined)

        expect(result).toBeInstanceOf(Object)
        expect(!!result.payload).toBe(true)
        expect(!!result.refreshToken).toBe(true)
        done()

    }, 5000);


    test('AuthFail', async () => {
        let user = {username: 'root', password: 'badpassword'}
        await expect(auth(user, null)).rejects.toMatch('BadCredentials');
    }, 2000);

    test('AuthUserDoesntExist', async () => {
        let user = {username: 'iamlegend', password: '321'}
        await expect(auth(user, null)).rejects.toMatch('UserDoesntExist');

    }, 2000);


/*
    test('Apikey', async () => {

        let user = await findUserByUsername('root')
        let result = await apiKey(user.id, null)
        await expect(result).toHaveProperty('token',)

    }, 2000);
    */


})

