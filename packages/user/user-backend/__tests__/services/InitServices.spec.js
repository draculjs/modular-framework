//Utils
const mongoHandler = require('../utils/mongo-handler');

import {
    initAdminRole,
    initOperatorRole, initOperatorUser,
    initPermissions, initRoles,
    initRootUser,
    initSupervisorRole, initSupervisorUser
} from "../../src/services/InitService";


describe("InitService", () => {


    beforeAll(async () => {
        await mongoHandler.connect()

    });

    afterAll(async () => {
        await mongoHandler.clearDatabase();
        await mongoHandler.closeDatabase();
    })


    test('InitRoles', async () => {
        await initPermissions()
        let result = await initRoles()
        expect(result).toHaveProperty('rolesCreated')
        expect(result).toHaveProperty('rolesUpdated')
    });

})