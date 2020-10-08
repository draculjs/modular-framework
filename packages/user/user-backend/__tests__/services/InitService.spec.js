const mongoHandler = require('../utils/mongo-handler');

//Init DB
import {initPermissions,initAdminRole,initRootUser} from "../../src/services/InitService";

import {findUserByUsername} from "../../src/services/UserService";
import {findRoleByName} from "../../src/services/RoleService";

describe("InitService", () => {


    afterAll(async  () => {
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
})