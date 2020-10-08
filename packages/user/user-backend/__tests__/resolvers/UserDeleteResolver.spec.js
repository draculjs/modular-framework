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

describe("UserDeleteResolver", () => {


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

    test('DeleteUserBySupervisorWithoutChildRoleNotAuthorized', async () => {

        const authUser = await findUserByUsername("supervisor")

        const userToDelete = await findUserByUsername("root")

        const rbac = await UserRbacFactory(authUser)

        await expect(() => UserResolvers.Mutation.deleteUser(null, { id: userToDelete.id}, {user: authUser, rbac}) )
            .rejects.toThrow('Not Authorized')

    });

    test('DeleteUserByOperatorWhitoutPermissionNotAuthorized', async () => {

        const authUser = await findUserByUsername("operator")

        const userToDelete = await findUserByUsername("operator")

        const rbac = await UserRbacFactory(authUser)

        await expect(() => UserResolvers.Mutation.deleteUser(null, { id: userToDelete.id}, {user: authUser, rbac}))
            .rejects.toThrow('Not Authorized')

    });


    test('DeleteUserBySupervisorWithChildRole', async () => {

        const authUser = await findUserByUsername("supervisor")

        const userToDelete = await findUserByUsername("operator")

        const rbac = await UserRbacFactory(authUser)

        const userDeleted = await UserResolvers.Mutation.deleteUser(null, { id: userToDelete.id}, {user: authUser, rbac})

        expect(userDeleted).toHaveProperty('success', true)

    });

    test('DeleteUserByAdmin', async () => {

        const authUser = await findUserByUsername("root")

        const userToDelete = await findUserByUsername("supervisor")

        const rbac = await UserRbacFactory(authUser)

        const userDeleted = await UserResolvers.Mutation.deleteUser(null, { id: userToDelete.id}, {user: authUser, rbac})

        expect(userDeleted).toHaveProperty('success', true)

    });




})