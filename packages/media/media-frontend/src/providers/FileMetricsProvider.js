class FileMetricsProvider {

    constructor() {
        this.gqlc = null
    }

    setGqlc(gqlc) {
        this.gqlc = gqlc
    }

    fileGlobalMetrics() {
        return this.gqlc.query({
            query: require('./gql/fileGlobalMetrics.graphql'),
            fetchPolicy: 'network-only'
        })
    }

    fileUserMetrics() {
        return this.gqlc.query({
            query: require('./gql/fileUserMetrics.graphql'),
            fetchPolicy: 'network-only'
        })
    }

    almacenamientoPorUsuario() {
        return this.gqlc.query({
            query: require('./gql/almacenamientoPorUsuario.graphql'),
            fetchPolicy: 'network-only'
        })
    }

    cantidadArchivosPorUsuario() {
        return this.gqlc.query({
            query: require('./gql/cantidadArchivosPorUsuario.graphql'),
            fetchPolicy: 'network-only'
        })
    }
}

const fileMetricsProvider = new FileMetricsProvider()

export default fileMetricsProvider
