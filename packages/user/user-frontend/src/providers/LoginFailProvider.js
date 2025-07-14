import loginFailByUsernameRaw from './gql/loginFailByUsername.graphql?raw';
import { ApolloClient, gql } from '@apollo/client/core';

const loginFailByUsernameGql = gql(loginFailByUsernameRaw);
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

    logginFailByUsername(time, unit) {
        return this.getGqlClient().query({
            query: loginFailByUsernameGql,
            variables: {time,unit},
            fetchPolicy:"network-only"})
    }
    
}

export default new SessionProvider()


