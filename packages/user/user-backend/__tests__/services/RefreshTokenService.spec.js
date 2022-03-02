//Utils
const mongoHandler = require('../utils/mongo-handler');

//Init DB
import {initPermissions,initAdminRole,initRootUser} from "../../src/services/InitService";

//Service to Test
import {
    auth
} from "../../src/services/AuthService";
import {encodePassword} from "../../src/services/PasswordService"

import {findUserByRefreshToken, findUsers} from "../../src/services/UserService";

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
        console.log("authResult",authResult.refreshToken)

        let users = await findUsers()
        console.log("users",JSON.stringify(users,null,4))


        let userResult = await findUserByRefreshToken(authResult.refreshToken.id)
        console.log("userResult",userResult)
        expect(userResult).not.toBe(null)
        expect(userResult.username).toBe('root')
        done()
    }, 5000);



})

