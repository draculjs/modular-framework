import {UserRbacFactory} from "../../src/services/RbacService";

const mongoHandler = require('../utils/mongo-handler');

import {
    initAdminRole,
    initOperatorRole,
    initSupervisorRole,
    initPermissions,
    initRootUser,
    initSupervisorUser,
    initOperatorUser
} from "../../src/services/InitService";

import UserResolvers from "../../src/graphql/resolvers/UserResolvers";
import {findUserByUsername} from "../../src/services/UserService";
import RoleResolvers from "../../src/graphql/resolvers/RoleResolvers";

describe("UserPaginateResolver", () => {


    beforeAll(async () => {
        await mongoHandler.connect()
        await initPermissions()
        await initAdminRole()
        await initOperatorRole()
        await initSupervisorRole()
        await initRootUser()
        await initSupervisorUser()
        await initOperatorUser()
    });

    afterAll(async () => {
        await mongoHandler.clearDatabase();
        await mongoHandler.closeDatabase();
    })

    test('RolesByAdmin', async () => {

        const user = await findUserByUsername("root")
        const rbac = await UserRbacFactory(user)

        const roles= await RoleResolvers.Query.roles(null, {}, {user, rbac})

        //Total items must be 3 for default users: root, supervisor, operator
        expect(roles.length).toBe(3)
    });

    test('RolesBySupervisorWithChildRole', async () => {

        const user = await findUserByUsername("supervisor")
        const rbac = await UserRbacFactory(user)

        const roles= await RoleResolvers.Query.roles(null, {}, {user, rbac})

        //Total items must be 3 for default users: root, supervisor, operator
        expect(roles.length).toBe(1)
    });


    test('RolesByOperatorWhitoutPermission', async () => {

        const user = await findUserByUsername("operator")
        const rbac = await UserRbacFactory(user)

        await expect(() => RoleResolvers.Query.roles(null, {}, {user, rbac}) )
            .rejects.toThrow('Not Authorized');
    });


})
