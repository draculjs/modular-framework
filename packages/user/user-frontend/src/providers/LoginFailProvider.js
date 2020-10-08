import graphqlClient from "../../../../apollo";

class SessionProvider {


    logginFailByUsername(time, unit) {
        return graphqlClient.query({
            query: require('./gql/loginFailByUsername.graphql'),
            variables: {time,unit},
            fetchPolicy:"network-only"})
    }
    


}

export default new SessionProvider()


