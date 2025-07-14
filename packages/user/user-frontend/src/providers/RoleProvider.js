import permissionsRaw from './gql/permissions.graphql?raw';
import rolesRaw from './gql/roles.graphql?raw';
import roleRaw from './gql/role.graphql?raw';
import roleCreateRaw from './gql/roleCreate.graphql?raw';
import roleUpdateRaw from './gql/roleUpdate.graphql?raw';
import roleDeleteRaw from './gql/roleDelete.graphql?raw';
import { ApolloClient, gql } from '@apollo/client/core';

const permissionsGql = gql(permissionsRaw);
const rolesGql = gql(rolesRaw);
const roleGql = gql(roleRaw);
const roleCreateGql = gql(roleCreateRaw);
const roleUpdateGql = gql(roleUpdateRaw);
const roleDeleteGql = gql(roleDeleteRaw);

class RoleProvider {
    constructor() {
        this.gqlc = null;
    }

    setGqlc(gqlc) {
        if (gqlc instanceof ApolloClient) {
            this.gqlc = gqlc;
        } else {
            throw new Error('gqlc must be an ApolloClient instance');
        }
    }

    getGqlClient() {
        if (!this.gqlc) {
            throw new Error('gqlc must be initialized');
        }
        return this.gqlc;
    }

    permissions() {
        return this.getGqlClient().query({
            query: permissionsGql,
            fetchPolicy: "network-only"
        });
    }

    roles() {
        return this.getGqlClient().query({
            query: rolesGql,
            fetchPolicy: "network-only"
        });
    }
    
    role(id) {
        return this.getGqlClient().query({
            query: roleGql,
            variables: { id },
            fetchPolicy: "network-only"
        });
    }
    
    roleCreate(form) {
        return this.getGqlClient().mutate({
            mutation: roleCreateGql,
            variables: { 
                name: form.name, 
                childRoles: form.childRoles,  
                permissions: form.permissions 
            }
        });
    }
    
    roleUpdate(form) {
        return this.getGqlClient().mutate({
            mutation: roleUpdateGql,
            variables: { 
                id: form.id, 
                name: form.name, 
                childRoles: form.childRoles,  
                permissions: form.permissions 
            }
        });
    }
    
    roleDelete(id) {
        return this.getGqlClient().mutate({
            mutation: roleDeleteGql,
            variables: { id }
        });
    }
}

const roleProvider = new RoleProvider();
export default roleProvider;