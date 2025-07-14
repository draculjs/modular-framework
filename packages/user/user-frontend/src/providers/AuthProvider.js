import authRaw from './gql/auth.graphql?raw';
import refreshTokenRaw from './gql/refreshToken.graphql?raw';
import apikeyRaw from './gql/apikey.graphql?raw';
import registerRaw from './gql/register.graphql?raw';
import activationUserRaw from './gql/activationUser.graphql?raw';
import meRaw from './gql/me.graphql?raw';
import { ApolloClient, gql } from '@apollo/client/core';

const authGql = gql(authRaw);
const refreshTokenGql = gql(refreshTokenRaw);
const apikeyGql = gql(apikeyRaw);
const registerGql = gql(registerRaw);
const activationUserGql = gql(activationUserRaw);
const meGql = gql(meRaw);

class AuthProvider {
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
            throw new Error('gqlc must be initialized. Call setGqlc() first.');
        }
        return this.gqlc;
    }

    auth(username, password) {
        return this.getGqlClient().mutate({
            mutation: authGql,
            variables: { username, password }
        });
    }

    refreshToken(refreshTokenId) {
        return this.getGqlClient().mutate({
            mutation: refreshTokenGql,
            variables: { refreshTokenId }
        });
    }

    apikey(userid) {
        return this.getGqlClient().mutate({
            mutation: apikeyGql,
            variables: { userid }
        });
    }

    register({ username, password, name, email, phone }) {
        return this.getGqlClient().mutate({
            mutation: registerGql,
            variables: { username, password, name, email, phone }
        });
    }

    activation(token) {
        return this.getGqlClient().mutate({
            mutation: activationUserGql,
            variables: { token }
        });
    }

    me() {
        return this.getGqlClient().query({
            query: meGql,
            fetchPolicy: "network-only"
        });
    }
}

const authProvider = new AuthProvider();
export default authProvider;