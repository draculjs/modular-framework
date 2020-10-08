//Utils
const mongoHandler = require('../utils/mongo-handler');

//Init DB
import {initPermissions,initAdminRole,initRootUser} from "../../src/services/InitService";

//Service to Test

import {
    apiKey,
    auth
} from "../../src/services/AuthService";

import {findUserByUsername} from "../../src/services/UserService";

//Service dependencies
import {findRoleByName} from "../../src/services/RoleService";

describe("UserService", () => {

    let connection;

    beforeAll(async () => {
        await mongoHandler.connect()
        await initPermissions()
        await initAdminRole()
        await initRootUser()
    });

    afterAll(async  () => {
        await mongoHandler.clearDatabase();
        await mongoHandler.closeDatabase();
    })



    test('LoginOk', async () => {

        let user = {username: 'root', password: 'root.123'}

        await expect(auth(user, null))
            .resolves.toHaveProperty('token')

    }, 2000);

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

