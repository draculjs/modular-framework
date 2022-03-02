//Utils
import AuthResolvers from "../../src/graphql/resolvers/AuthResolvers";

const mongoHandler = require('../utils/mongo-handler');

//Init DB
import {initPermissions, initAdminRole, initRootUser} from "../../src/services/InitService";

//Service to Test
import {
    auth, generateRefreshToken
} from "../../src/services/AuthService";
import {encodePassword} from "../../src/services/PasswordService"

import {findUserByRefreshToken, findUserByUsername, findUsers} from "../../src/services/UserService";

describe("RefreshTokenService", () => {

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

    test('findUserByRefreshToken', async (done) => {

        let user = {username: 'root', password: 'root.123'}
        user.password = encodePassword(user.password)

        let authResult = await auth(user, null)
        console.log("authResult", authResult.refreshToken)

        let users = await findUsers()
        console.log("users", JSON.stringify(users, null, 4))


        let userResult = await findUserByRefreshToken(authResult.refreshToken.id)
        console.log("userResult", userResult)
        expect(userResult).not.toBe(null)
        expect(userResult.username).toBe('root')
        done()
    }, 5000);


    test('generateRefreshToken', async (done) => {

        //AUTH
        let user = {username: 'root', password: 'root.123'}
        user.password = encodePassword(user.password)
        let authResult = await auth(user, null)

        console.log("authResult", authResult)

        let refreshToken = generateRefreshToken(authResult.payload.idSession)
        expect(refreshToken).not.toBe(null)
        done()
    })


    test('Remove old refresh tokens', async (done) => {

        //AUTH
        process.env.JWT_REFRESHTOKEN_EXPIRED_IN = '2s'
        let user = {username: 'root', password: 'root.123'}
        user.password = encodePassword(user.password)
        await auth(user, null)
        await auth(user, null)
        await auth(user, null)

        let userRoot = await findUserByUsername('root')
        expect(userRoot.refreshToken.length === 3)

        setTimeout(async () => {
            await auth(user, null)

            let userRoot = await findUserByUsername('root')
            expect(userRoot.refreshToken.length === 1)
            done()
        }, 4000)


    })


    test('Invalid refresh token', () => {
        return expect(AuthResolvers.Mutation.refreshToken(null,{refreshTokenId:"asd"},{req:null}))
            .rejects.toThrow('Invalid RefreshToken');
    }, 10000)

})

