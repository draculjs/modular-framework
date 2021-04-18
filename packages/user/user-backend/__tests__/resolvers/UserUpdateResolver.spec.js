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

describe("UserUpdateResolver", () => {


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

    test('UpdateUserByAdmin', async () => {

        const authUser = await findUserByUsername("root")

        const userToUpdate = await findUserByUsername("operator")

        const rbac = await UserRbacFactory(authUser)

        const input = {
            name: userToUpdate.name,
            username: userToUpdate.username,
            email: userToUpdate.email,
            role: userToUpdate.role.id,
            active: false
        }

        const userUpdated = await UserResolvers.Mutation.updateUser(
            null,
            { id: userToUpdate.id, input},
            {user: authUser, rbac})

        expect(userUpdated).toHaveProperty('id')
        expect(userUpdated).toHaveProperty('username', 'operator')
        expect(userUpdated).toHaveProperty('active', false)
    });

    test('UpdateUserBySupervisorWithChildRole', async () => {

        const authUser = await findUserByUsername("supervisor")

        const userToUpdate = await findUserByUsername("operator")

        const rbac = await UserRbacFactory(authUser)

        const input = {
            name: userToUpdate.name,
            username: userToUpdate.username,
            email: userToUpdate.email,
            role: userToUpdate.role.id,
            active: false
        }

        const userUpdated = await UserResolvers.Mutation.updateUser(
            null,
            { id: userToUpdate.id, input},
            {user: authUser, rbac})

        expect(userUpdated).toHaveProperty('id')
        expect(userUpdated).toHaveProperty('username', 'operator')
        expect(userUpdated).toHaveProperty('active', false)
    });

    test('UpdateUserBySupervisorWithoutChildRoleNotAuthorized', async () => {

        const authUser = await findUserByUsername("supervisor")

        const userToUpdate = await findUserByUsername("root")

        const rbac = await UserRbacFactory(authUser)

        const input = {
            name: userToUpdate.name,
            username: userToUpdate.username,
            email: userToUpdate.email,
            role: userToUpdate.role.id,
            active: false
        }


        await expect(() => UserResolvers.Mutation.updateUser(null, { id: userToUpdate.id, input}, {user: authUser, rbac}) )
            .rejects.toThrow('Not Authorized');

    });

    test('UpdateUserByOperatorWhitoutPermissionNotAuthorized', async () => {

        const authUser = await findUserByUsername("operator")

        const userToUpdate = await findUserByUsername("supervisor")

        const rbac = await UserRbacFactory(authUser)

        const input = {
            name: userToUpdate.name,
            username: userToUpdate.username,
            email: userToUpdate.email,
            role: userToUpdate.role.id,
            active: false
        }


        await expect(() => UserResolvers.Mutation.updateUser(null, { id: userToUpdate.id, input}, {user: authUser, rbac}) )
            .rejects.toThrow('Not Authorized');

    });


})
