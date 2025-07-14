import userAdminChangePasswordRaw from './gql/userAdminChangePassword.graphql?raw';
import userAdminChangeAvatarRaw from './gql/userAdminChangeAvatar.graphql?raw';
import fetchPasswordRulesRaw from './gql/fetchPasswordRules.graphql?raw';
import userPaginateRaw from './gql/userPaginate.graphql?raw';
import usersByRolesRaw from './gql/usersByRoles.graphql?raw';
import usersByRoleRaw from './gql/usersByRole.graphql?raw';
import userCreateRaw from './gql/userCreate.graphql?raw';
import userUpdateRaw from './gql/userUpdate.graphql?raw';
import userDeleteRaw from './gql/userDelete.graphql?raw';
import groupsRaw from './gql/groups.graphql?raw';
import usersRaw from './gql/users.graphql?raw';
import rolesRaw from './gql/roles.graphql?raw';
import userRaw from './gql/user.graphql?raw';
import { gql } from '@apollo/client/core'

// Convertir todos los imports a DocumentNodes usando gql
const userAdminChangePasswordGql = gql(userAdminChangePasswordRaw);
const userAdminChangeAvatarGql = gql(userAdminChangeAvatarRaw);
const fetchPasswordRulesGql = gql(fetchPasswordRulesRaw);
const userPaginateGql = gql(userPaginateRaw);
const usersByRolesGql = gql(usersByRolesRaw);
const usersByRoleGql = gql(usersByRoleRaw);
const userCreateGql = gql(userCreateRaw);
const userUpdateGql = gql(userUpdateRaw);
const userDeleteGql = gql(userDeleteRaw);
const groupsGql = gql(groupsRaw);
const usersGql = gql(usersRaw);
const rolesGql = gql(rolesRaw);
const userGql = gql(userRaw);

class UserProvider {
    constructor() {
        this.gqlc = null;
    }

    setGqlc(gqlc) {
        this.gqlc = gqlc;
    }

    paginateUsers(limit, pageNumber, search = null, orderBy = null, orderDesc = false, activeUsers = false) {
        return this.gqlc.query({
            query: userPaginateGql,
            variables: { limit, pageNumber, search, orderBy, orderDesc, activeUsers },
            fetchPolicy: "network-only"
        });
    }

    user(id) {
        return this.gqlc.query({
            query: userGql,
            fetchPolicy: "network-only",
            variables: { id }
        });
    }

    users() {
        return this.gqlc.query({
            query: usersGql,
            fetchPolicy: "network-only"
        });
    }

    usersByRole(roleName) {
        return this.gqlc.query({
            query: usersByRoleGql,
            fetchPolicy: "network-only",
            variables: { roleName }
        });
    }

    usersByRoles(roleNames) {
        return this.gqlc.query({
            query: usersByRolesGql,
            fetchPolicy: "network-only",
            variables: { roleNames }
        });
    }

    roles() {
        return this.gqlc.query({
            query: rolesGql,
            fetchPolicy: "network-only"
        });
    }

    groups() {
        return this.gqlc.query({
            query: groupsGql,
            fetchPolicy: "network-only"
        });
    }

    createUser({ username, password, name, email, phone, role, groups, active }) {
        return this.gqlc.mutate({
            mutation: userCreateGql,
            variables: { username, password, name, email, phone, role, groups, active }
        });
    }

    updateUser({ id, name, username, email, phone, role, groups, active }) {
        return this.gqlc.mutate({
            mutation: userUpdateGql,
            variables: { id, name, username, email, phone, role, groups, active }
        });
    }

    deleteUser(id) {
        return this.gqlc.mutate({
            mutation: userDeleteGql,
            variables: { id }
        });
    }

    adminChangePassword(id, password, passwordVerify) {
        return this.gqlc.mutate({
            mutation: userAdminChangePasswordGql,
            variables: { id, password, passwordVerify }
        });
    }

    adminAvatarUpload(id, file) {
        return this.gqlc.mutate({
            mutation: userAdminChangeAvatarGql,
            variables: { id, file }
        });
    }

    fetchPasswordRules() {
        return this.gqlc.query({
            query: fetchPasswordRulesGql,
            fetchPolicy: "network-only"
        });
    }
}

const userProvider = new UserProvider();
export default userProvider;