import fetchMediaVariablesRaw from './gql/fetchMediaVariables.graphql?raw';
import userStorageFetchRaw from './gql/userStorageFetch.graphql?raw';
import userStorageFindByUserRaw from './gql/userStorageFindByUser.graphql?raw';
import userStorageUpdateRaw from './gql/userStorageUpdate.graphql?raw';
import { ApolloClient, gql } from '@apollo/client/core';

const fetchMediaVariablesGql = gql(fetchMediaVariablesRaw);
const userStorageFetchGql = gql(userStorageFetchRaw);
const userStorageFindByUserGql = gql(userStorageFindByUserRaw);
const userStorageUpdateGql = gql(userStorageUpdateRaw);

class UserStorageProvider {
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

    fetchMediaVariables() {
        return this.getGqlClient().query({
            query: fetchMediaVariablesGql,
            fetchPolicy: "network-only"
        });
    }

    fetchUserStorage() {
        return this.getGqlClient().query({
            query: userStorageFetchGql,
            fetchPolicy: "network-only"
        });
    }

    findUserStorageByUser() {
        return this.getGqlClient().query({
            query: userStorageFindByUserGql,
            fetchPolicy: "network-only"
        });
    }

    updateUserStorage(form) {
        return this.getGqlClient().mutate({
            mutation: userStorageUpdateGql,
            variables: form,
            fetchPolicy: "no-cache"
        });
    }
}

export default new UserStorageProvider();