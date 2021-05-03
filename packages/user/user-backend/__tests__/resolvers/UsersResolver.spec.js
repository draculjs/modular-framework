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
import {findRoleByName} from "../../src/services/RoleService";

describe("UsersResolver", () => {


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

    test('UsersByAdmin', async () => {

        const user = await findUserByUsername("root")
        const rbac = await UserRbacFactory(user)

        const users = await UserResolvers.Query.users(null, {}, {user, rbac})

        //Total items must be 3 for default users: root, supervisor, operator
        expect(users.length).toBe(3)
    });

    test('UsersBySupervisorWithChildRole', async () => {

        const user = await findUserByUsername("supervisor")
        const rbac = await UserRbacFactory(user)

        const users = await UserResolvers.Query.users(null, {}, {user, rbac})

        //Total items must be 1 for default users: operator
        expect(users.length).toBe(2)

    });


    test('UsersByOperatorWhitoutPermission', async () => {

        const user = await findUserByUsername("operator")
        const rbac = await UserRbacFactory(user)


        await expect(() => UserResolvers.Query.users(null, {}, {user, rbac}) )
            .toThrow('Not Authorized');

    });


})
