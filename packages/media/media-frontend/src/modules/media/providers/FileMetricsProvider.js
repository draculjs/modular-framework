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
        })
    }

    fileUserMetrics() {
        return this.gqlc.query({
            query: require('./gql/fileUserMetrics.graphql'),
        })
    }

    almacenamientoPorUsuario() {
        return this.gqlc.query({
            query: require('./gql/almacenamientoPorUsuario.graphql'),
        })
    }

    cantidadArchivosPorUsuario() {
        return this.gqlc.query({
            query: require('./gql/cantidadArchivosPorUsuario.graphql'),
        })
    }
}

const fileMetricsProvider = new FileMetricsProvider()

export default fileMetricsProvider
