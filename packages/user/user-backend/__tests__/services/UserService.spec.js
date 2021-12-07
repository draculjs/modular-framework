//Utils
import { changePassword } from "../../src/services/ProfileService";

const mongoHandler = require('../utils/mongo-handler');

//Init DB
import { initPermissions, initAdminRole, initRootUser } from "../../src/services/InitService";

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
import { findRoleByName } from "../../src/services/RoleService";
import { createGroup, findGroup } from "../../src/services/GroupService";

describe("UserService", () => {

    let connection;
    let testGroupOne;
    let testGroupTwo;
    let testGroupThree;

    beforeAll(async () => {
        await mongoHandler.connect()
        await initPermissions()
        await initAdminRole()
        await initRootUser()
        testGroupOne = await createGroup(null, { name: "testOne", color: "#ffffff", users: [] })
        testGroupTwo = await createGroup(null, { name: "testTwo", color: "#ffffff", users: [] })
        testGroupThree = await createGroup(null, { name: "testThree", color: "#ffffff", users: [] })
    });

    afterAll(async () => {
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
            role: role.id
        }

        await expect(createUser(userDoc, null)).resolves.toHaveProperty('username', 'jrambo')

    }, 2000);

    test('createUserWithGroupOk ', async () => {
        let role = await findRoleByName('admin')
        let userDoc = {
            username: 'jrambun',
            email: 'jrambun@gmail.com',
            name: 'Jhon Rambun',
            password: '123',
            groups: [testGroupOne.id],
            role: role.id
        }
        let user = await createUser(userDoc, null)
        let group = await findGroup(testGroupOne.id)
        await expect(group.users).toHaveLength(1)
        await expect(group.users[0].toString()).toEqual(user.id)

    }, 2000);

    test('updateUserWithGroupOk ', async () => {
        let role = await findRoleByName('admin')
        let userDoc = {
            username: 'jrambito',
            email: 'jrambito@gmail.com',
            name: 'Jhon Rambito',
            password: '123',
            groups: [testGroupThree.id],
            role: role.id,
            active: true
        }
        let user = await createUser(userDoc, null)
        let group = await findGroup(testGroupThree.id)
        await expect(group.users).toHaveLength(1)
        await expect(group.users[0].toString()).toEqual(user.id)

        userDoc.groups = [testGroupTwo.id]
        user = await updateUser(user.id, userDoc, null)

        let groupThree = await findGroup(testGroupThree.id)
        let groupTwo = await findGroup(testGroupTwo.id)


        console.log("user", user.groups)
        console.log("groupThree Users", groupThree.users)
        console.log("groupTwo Users", groupTwo.users)

        await expect(groupThree.users).toHaveLength(0)

        await expect(groupTwo.users).toHaveLength(1)
        //await expect(groupTwo.users[0].toString()).toEqual(user.id)

    }, 2000);



    test('updateUserEmailValidationFail', async () => {
        let user = await findUserByUsername('root')
        user.email = 'wrongemailformat'

        await expect(updateUser(user.id, user, null)).rejects.toThrow('Validation failed: email: validation.emailFormat');

    }, 2000);


    test('updateUserOk ', async () => {
        let user = await findUserByUsername('jrambo')
        user.name = 'Jhon Rambo Reloaded'

        await expect(updateUser(user.id, user, null)).resolves.toHaveProperty('username', 'jrambo')

    }, 2000);


    test('ChangePasswordOk', async () => {
        let user = await findUserByUsername('jrambo')

        await expect(changePassword(user.id, { currentPassword: '123', newPassword: 'abc' }, user))
            .resolves.toHaveProperty('status', true);


    }, 2000);

    test('deleteUserOk ', async () => {
        let user = await findUserByUsername('jrambo')
        user.name = 'Jhon Rambo Reloaded'

        await expect(deleteUser(user.id)).resolves.toHaveProperty('success', true)

    }, 2000);

})

