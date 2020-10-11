import graphqlClient from "../../../apollo";

class FileMetricsProvider {

    constructor() {
        this.gqlc = graphqlClient
    }

    setGqlc(gqlc){
        this.gqlc = gqlc
    }

    fileGlobalMetrics() {
        return this.gqlc.query({
            query: require('./gql/fileGlobalMetrics.graphql'),
        })
    }
}

const fileMetricsProvider = new FileMetricsProvider()

export default fileMetricsProvider
