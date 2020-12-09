//Utils
import {changePassword} from "../../src/services/ProfileService";

const mongoHandler = require('../utils/mongo-handler');

//Init DB
import {initPermissions,initAdminRole,initRootUser} from "../../src/services/InitService";

//Service to Test
import {
    createUser,
    deleteUser,
    findUserByUsername,
    updateUser
} from "../../src/services/UserService";

import {
    auth
} from "../../src/services/AuthService";

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


    test('createUserOk ', async () => {
        let role = await findRoleByName('admin')
        let userDoc = {
            username: 'jrambo',
            email: 'jrambo@gmail.com',
            name: 'Jhon Rambo',
            password: '123',
            role:  role.id
        }

        await expect(createUser(userDoc, null)).resolves.toHaveProperty('username','jrambo')

    }, 2000);

    test('updateUserEmailValidationFail', async () => {
        let user = await findUserByUsername('root')
        user.email = 'wrongemailformat'

        await expect(updateUser(user.id,user, null)).rejects.toThrow('Validation failed: email: validation.emailFormat');

    }, 2000);


    test('updateUserOk ', async () => {
        let user = await findUserByUsername('jrambo')
        user.name = 'Jhon Rambo Reloaded'

        await expect(updateUser(user.id,user, null)).resolves.toHaveProperty('username','jrambo')

    }, 2000);


    test('ChangePasswordOk', async () => {
        let user = await findUserByUsername('jrambo')

        await expect(changePassword(user.id, {currentPassword:'123',newPassword: 'abc'}, user))
            .resolves.toHaveProperty('status', true);


    }, 2000);

    test('deleteUserOk ', async () => {
        let user = await findUserByUsername('jrambo')
        user.name = 'Jhon Rambo Reloaded'

        await expect(deleteUser(user.id)).resolves.toHaveProperty('success',true)

    }, 2000);

})

