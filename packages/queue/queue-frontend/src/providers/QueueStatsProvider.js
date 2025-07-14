import queueStatsRaw from './gql/queueStats.graphql?raw';
import { ApolloClient, gql } from '@apollo/client/core';

const queueStatsGql = gql(queueStatsRaw);

class QueueStatsProvider {
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

    queueStats() {
        return this.getGqlClient().query({
            query: queueStatsGql
        });
    }
}

const queueStatsProvider = new QueueStatsProvider();
export default queueStatsProvider;