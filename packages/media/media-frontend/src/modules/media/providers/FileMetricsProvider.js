class FileMetricsProvider {

    constructor() {
        this.gqlc = null
    }

    setGqlc(gqlc){
        this.gqlc = gqlc
    }

    fileGlobalMetrics() {
        return this.gqlc.query({
            query: require('./gql/fileGlobalMetrics.graphql'),
        })
    }
    fileUserMetrics() {
        return this.gqlc.query({
            query: require('./gql/fileUserMetrics.graphql'),
        })
    }
}

const fileMetricsProvider = new FileMetricsProvider()

export default fileMetricsProvider
