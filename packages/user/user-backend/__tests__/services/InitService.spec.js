const mongoHandler = require('../utils/mongo-handler');

//Init DB
import {initPermissions, initAdminRole, initRootUser, initRoles} from "../../src/services/InitService";

import {findUserByUsername} from "../../src/services/UserService";
import {findRoleByName} from "../../src/services/RoleService";

describe("InitService", () => {


    afterAll(async () => {
        await mongoHandler.clearDatabase();
        await mongoHandler.closeDatabase();
    })

    test('Token Ok', async () => {

        await mongoHandler.connect()
        await initPermissions()
        await initPermissions(["FOO", "BAR"])
        await initAdminRole()
        await initRootUser()

        let role = await findRoleByName("admin")

        expect(role.permissions).toContain('FOO');

    });

    test('Init Role with childRole', async () => {
        await mongoHandler.connect()

        let FooRole = {
            name: "FooRole",
            permissions: [
                "SOME_PERMISSION",
            ]
        }

        let BarRole = {
            name: "BarRole",
            childRoles: ['FooRole'],
            permissions: [
                "SOME_PERMISSION",
            ]
        }

        await initRoles([FooRole, BarRole])


        let role = await findRoleByName("BarRole")
        expect(role.childRoles.length).toBe(1)

        let MouRole = {
            name: "MouRole",
            permissions: [
                "SOME_PERMISSION",
            ]
        }

        let BarRoleToUpdate = {
            name: "BarRole",
            childRoles: ['FooRole', "MouRole"],
            permissions: [
                "SOME_PERMISSION",
                "SOME_PERMISSION_2"
            ]
        }

        await initRoles([MouRole, BarRoleToUpdate])
        let roleU = await findRoleByName("BarRole")
        console.log(roleU)
        expect(roleU.childRoles.length).toBe(2)

    });

})
