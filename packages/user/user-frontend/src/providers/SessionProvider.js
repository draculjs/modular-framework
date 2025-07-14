import sessionsByUserRaw from './gql/sessionsByUser.graphql?raw';
import dashboardDataRaw from './gql/dashboardData.graphql?raw';
import { ApolloClient, gql } from '@apollo/client/core';

const sessionsByUserGql = gql(sessionsByUserRaw);
const dashboardDataGql = gql(dashboardDataRaw);

class SessionProvider {
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

    sessionsByUser() {
        return this.getGqlClient().query({
            query: sessionsByUserGql,
            fetchPolicy: "network-only"
        });
    }

    dashboardData() {
        return this.getGqlClient().query({
            query: dashboardDataGql,
            fetchPolicy: "network-only"
        });
    }
}

const sessionProvider = new SessionProvider();
export default sessionProvider;