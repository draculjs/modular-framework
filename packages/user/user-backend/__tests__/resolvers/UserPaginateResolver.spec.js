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

    test('UserPaginateByAdmin', async () => {

        const user = await findUserByUsername("root")
        const rbac = await UserRbacFactory(user)

        const input = {limit: 5, pageNumber: 1, search: null, orderBy: null, orderDesc: null}

        const usersPaginated = await UserResolvers.Query.paginateUsers(null, {input}, {user, rbac})

        //Total items must be 3 for default users: root, supervisor, operator
        expect(usersPaginated.totalItems).toBe(3)
    });

    test('UserPaginateBySupervisorWithChildRole', async () => {

        const user = await findUserByUsername("supervisor")
        const rbac = await UserRbacFactory(user)

        const input = {limit: 5, pageNumber: 1, search: null, orderBy: null, orderDesc: null}

        const usersPaginated = await UserResolvers.Query.paginateUsers(null, {input}, {user, rbac})

        //Total items must be 3 for default users: root, supervisor, operator
        expect(usersPaginated.totalItems).toBe(1)
    });


    test('UserPaginateByOperatorWhitoutPermission', async () => {

        const user = await findUserByUsername("operator")
        const rbac = await UserRbacFactory(user)

        const input = {limit: 5, pageNumber: 1, search: null, orderBy: null, orderDesc: null}


        await expect(() => UserResolvers.Query.paginateUsers(null, { input }, {user, rbac}) )
            .rejects.toThrow('Not Authorized');

    });


})
