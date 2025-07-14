import validateTokenRaw from './gql/validateToken.graphql?raw';
import recoveryByEmailRaw from './gql/recoveryByEmail.graphql?raw';
import recoveryByCodeRaw from './gql/recoveryByCode.graphql?raw';
import recoveryChangePasswordRaw from './gql/recoveryChangePassword.graphql?raw';
import recoveryChangePasswordCodeRaw from './gql/recoveryChangePasswordCode.graphql?raw';
import { ApolloClient, gql } from '@apollo/client/core';

const validateTokenGql = gql(validateTokenRaw);
const recoveryByEmailGql = gql(recoveryByEmailRaw);
const recoveryByCodeGql = gql(recoveryByCodeRaw);
const recoveryChangePasswordGql = gql(recoveryChangePasswordRaw);
const recoveryChangePasswordCodeGql = gql(recoveryChangePasswordCodeRaw);

class RecoveryProvider {
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
        if (!this.gqlc) throw new Error('gqlc must be initialized');
        return this.gqlc;
    }

    validateToken(token) {
        return this.getGqlClient().mutate({
            mutation: validateTokenGql,
            variables: { token }
        });
    }

    recoveryByEmail(email) {
        return this.getGqlClient().mutate({
            mutation: recoveryByEmailGql,
            variables: { email }
        });
    }

    recoveryByCode(email) {
        return this.getGqlClient().mutate({
            mutation: recoveryByCodeGql,
            variables: { email }
        });
    }

    recoveryChangePassword(token, newPassword) {
        return this.getGqlClient().mutate({
            mutation: recoveryChangePasswordGql,
            variables: { token, newPassword }
        });
    }

    recoveryChangePasswordCode(code, newPassword) {
        return this.getGqlClient().mutate({
            mutation: recoveryChangePasswordCodeGql,
            variables: { code, newPassword }
        });
    }
}

const recoveryProvider = new RecoveryProvider();
export default recoveryProvider;