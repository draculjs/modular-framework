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

describe("UserCreateResolver", () => {


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

    test('CreateUserByAdmin', async () => {

        const user = await findUserByUsername("root")
        const rbac = await UserRbacFactory(user)

        const role = await findRoleByName("supervisor")

        const input = {
            username: 'jrambo',
            password: '123',
            email: 'jrambo@asd.com',
            name: 'John Rambo',
            role: role.id
        }

        const userCreated = await UserResolvers.Mutation.createUser(null, {input}, {user, rbac})

        expect(userCreated).toHaveProperty('id')
        expect(userCreated).toHaveProperty('username', 'jrambo')
    });

    test('CreateUserBySupervisorWithChildRole', async () => {

        const user = await findUserByUsername("supervisor")
        const rbac = await UserRbacFactory(user)

        const role = await findRoleByName("operator")

        const input = {
            username: 'jwick',
            password: '123',
            email: 'jwick@asd.com',
            name: 'John Wick',
            role: role.id
        }

        const userCreated = await UserResolvers.Mutation.createUser(null, {input}, {user, rbac})

        expect(userCreated).toHaveProperty('id')
        expect(userCreated).toHaveProperty('username', 'jwick')
    });

    test('CreateUserBySupervisorWithoutChildRoleNotAuthorized', async () => {


        const user = await findUserByUsername("supervisor")
        const rbac = await UserRbacFactory(user)

        const role = await findRoleByName("admin")

        const input = {
            username: 'jryan',
            password: '123',
            email: 'jryan@asd.com',
            name: 'Jack Ryan',
            role: role.id
        }

        await expect(() => UserResolvers.Mutation.createUser(null, {input}, {user, rbac}) )
            .rejects.toThrow('Not Authorized');
    });

    test('CreateUserByOperatorWhitoutPermissionNotAuthorized', async () => {


        const user = await findUserByUsername("operator")
        const rbac = await UserRbacFactory(user)

        const role = await findRoleByName("operator")

        const input = {
            username: 'jblack',
            password: '123',
            email: 'jblack@asd.com',
            name: 'Jack Black',
            role: role.id
        }

        await expect(() => UserResolvers.Mutation.createUser(null, {input}, {user, rbac}) )
            .rejects.toThrow('Not Authorized');
    });
})
