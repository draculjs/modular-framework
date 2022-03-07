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
    updateUser,
    UserEventEmitter,
} from "../../src/services/UserService";

import {
    auth
} from "../../src/services/AuthService";

//Service dependencies
import {findRoleByName} from "../../src/services/RoleService";
import {createGroup, findGroup} from "../../src/services/GroupService";

describe("UserEvent", () => {

    let connection;
    let testGroupOne;
    let testGroupTwo;
    let testGroupThree;

    beforeAll(async () => {
        await mongoHandler.connect()
        await initPermissions()
        await initAdminRole()
        await initRootUser()
        testGroupOne = await createGroup(null,{name:"testOne",color:"#ffffff", users: []})
        testGroupTwo = await createGroup(null,{name:"testTwo",color:"#ffffff", users: []})
        testGroupThree = await createGroup(null,{name:"testThree",color:"#ffffff", users: []})
    });

    afterAll(async  () => {
        await mongoHandler.clearDatabase();
        await mongoHandler.closeDatabase();
    })


    test('createUser event', async () => {

        let role = await findRoleByName('admin')
        let userDoc = {
            username: 'jrambo',
            email: 'jrambo@gmail.com',
            name: 'Jhon Rambo',
            password: '123',
            role:  role.id
        }

        return new Promise(async (resolve, reject) => {

            UserEventEmitter.on('created', (userDoc) => {

                console.log("Usuario creado: ", userDoc.username)

                expect(userDoc).toHaveProperty('username','jrambo')

                resolve()

            })
            await expect(createUser(userDoc, null)).resolves.toHaveProperty('username','jrambo')

        })
    }, 2000);


    test('updateUser event', async () => {

        let role = await findRoleByName('admin')
        let userDoc = {
            username: 'jwick',
            email: 'jwick@gmail.com',
            name: 'Jhon Wick',
            password: '123',
            role:  role.id
        }

        let user = await createUser(userDoc, null)

        return new Promise(async (resolve, reject) => {

            UserEventEmitter.on('updated', (userDoc) => {

                console.log("Usuario actualizado: ", userDoc.username)

                expect(userDoc).toHaveProperty('username','jhon.wick')

                resolve()

            })

            user.username = "jhon.wick"
            await expect(updateUser(user.id,user)).resolves.toHaveProperty('username','jhon.wick')

        })
    }, 2000);

    test('deleteUser event', async () => {

        let role = await findRoleByName('admin')
        let userDoc = {
            username: 'jmaclane',
            email: 'jmaclane@gmail.com',
            name: 'Jhon maclane',
            password: '123',
            role:  role.id
        }

        let user = await createUser(userDoc, null)

        return new Promise(async (resolve, reject) => {

            UserEventEmitter.on('deleted', (userDoc) => {

                console.log("Usuario actualizado: ", userDoc.username)

                expect(userDoc).toHaveProperty('id',user.id)
                expect(userDoc).toHaveProperty('username','jmaclane')

                resolve()

            })

            await expect(deleteUser(user.id)).resolves.toHaveProperty('success',true)

        })
    }, 2000);

})

