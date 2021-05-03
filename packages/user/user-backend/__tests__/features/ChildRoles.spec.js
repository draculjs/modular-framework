//Utils
const mongoHandler = require('../utils/mongo-handler');

import {
    initAdminRole,
    initOperatorRole,
    initPermissions,
    initRootUser,
    initSupervisorRole,
    initSupervisorUser
} from "../../src/services/InitService";
import {auth} from "../../src/services/AuthService";
import {encodePassword} from "../../src/services/PasswordService"


describe("ChildRoles", () => {


    beforeAll(async () => {
        await mongoHandler.connect()
        await initPermissions()
        await initAdminRole()
        await initOperatorRole()
        await initSupervisorRole()
        await initRootUser()
        await initSupervisorUser()
    });

    afterAll(async  () => {
        await mongoHandler.clearDatabase();
        await mongoHandler.closeDatabase();
    })



    test('LoginShowChildRoles', async () => {
        let user = {username: 'supervisor', password: 'supervisor.123'}
        user.password = encodePassword(user.password)

        await expect(auth(user, null))
            .resolves.toHaveProperty('token',)

    });

})