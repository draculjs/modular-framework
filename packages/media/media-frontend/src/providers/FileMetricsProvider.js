import fileGlobalMetricsRaw from './gql/fileGlobalMetrics.graphql?raw';
import fileUserMetricsRaw from './gql/fileUserMetrics.graphql?raw';
import almacenamientoPorUsuarioRaw from './gql/almacenamientoPorUsuario.graphql?raw';
import cantidadArchivosPorUsuarioRaw from './gql/cantidadArchivosPorUsuario.graphql?raw';
import { ApolloClient, gql } from '@apollo/client/core';

const fileGlobalMetricsGql = gql(fileGlobalMetricsRaw);
const fileUserMetricsGql = gql(fileUserMetricsRaw);
const almacenamientoPorUsuarioGql = gql(almacenamientoPorUsuarioRaw);
const cantidadArchivosPorUsuarioGql = gql(cantidadArchivosPorUsuarioRaw);

class FileMetricsProvider {
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

    fileGlobalMetrics() {
        return this.getGqlClient().query({
            query: fileGlobalMetricsGql,
            fetchPolicy: 'network-only'
        });
    }

    fileUserMetrics() {
        return this.getGqlClient().query({
            query: fileUserMetricsGql,
            fetchPolicy: 'network-only'
        });
    }

    almacenamientoPorUsuario() {
        return this.getGqlClient().query({
            query: almacenamientoPorUsuarioGql,
            fetchPolicy: 'network-only'
        });
    }

    cantidadArchivosPorUsuario() {
        return this.getGqlClient().query({
            query: cantidadArchivosPorUsuarioGql,
            fetchPolicy: 'network-only'
        });
    }
}

const fileMetricsProvider = new FileMetricsProvider();
export default fileMetricsProvider;