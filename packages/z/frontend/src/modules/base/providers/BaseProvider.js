import pingRaw from './gql/ping.graphql?raw';
import pingTimeoutRaw from './gql/pingTimeout.graphql?raw';
import { ApolloClient, gql } from '@apollo/client/core';

const pingRawGql = gql(pingRaw);
const pingTimeoutRawGql = gql(pingTimeoutRaw);


import apolloClient from '../../../apollo'
class BaseProvider {

    constructor() {
        this.gqlc = null
    }

    setGqlc(gqlc) {
        if (gqlc instanceof ApolloClient) {
            this.gqlc = gqlc;
        } else {
            throw new Error('gqlc must be an ApolloClient instance');
        }
    }

    ping(){
        return this.gqlc.query({
            query: pingRawGql
        })
    }

    pingTimeout(){
        return this.gqlc.query({
            query: pingTimeoutRawGql
        })
    }
}
const baseProvider = new BaseProvider()
baseProvider.setGqlc(apolloClient)
export default baseProvider
