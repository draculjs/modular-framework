//Utils
const mongoHandler = require('../utils/mongo-handler');

//Init DB
import {initPermissions, initAdminRole, initRootUser} from "../../src/services/InitService";

//Service to Test

import {
    apiKey,
    auth
} from "../../src/services/AuthService";
import {encodePassword} from "../../src/services/PasswordService"
import {findUserByUsername} from "../../src/services/UserService";
import AuthResolvers from "../../src/graphql/resolvers/AuthResolvers"

describe("UserService", () => {

    beforeAll(async () => {
        await mongoHandler.connect()
        await initPermissions()
        await initAdminRole()
        await initRootUser()
    });

    afterAll(async () => {
        await mongoHandler.clearDatabase();
        await mongoHandler.closeDatabase();
    })

    test('LoginOk', async (done) => {

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

    test('LoginFail', async () => {

        let user = {username: 'root', password: 'badpassword'}

        await expect(auth(user, null))
            .rejects.toMatch('BadCredentials');

    }, 2000);

    test('LoginUserDoesntExist', async () => {

        let user = {username: 'iamlegend', password: '321'}

        await expect(auth(user, null))
            .rejects.toMatch('UserDoesntExist');

    }, 2000);


    test('Apikey', async () => {

        let user = await findUserByUsername('root')
        let result = await apiKey(user.id, null)
        await expect(result).toHaveProperty('token',)

    }, 2000);


})

