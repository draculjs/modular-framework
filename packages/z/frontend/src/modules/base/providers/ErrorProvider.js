import apolloClient from '../../../apollo';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client/core';
import { HttpLink } from '@apollo/client/link/http';

class ErrorProvider {
    constructor() {
        this.gqlc = null;
        this.gqlcFail = null;
        this.buildGqlcFail();
    }

    setGqlc(gqlc) {
        this.gqlc = gqlc;
    }

    buildGqlcFail() {
        this.gqlcFail = new ApolloClient({
            link: new HttpLink({ 
                uri: "http://localhost:777/graphql",
            }),
            cache: new InMemoryCache(),
        });
    }

    // Métodos de consulta manteniendo gql template literals
    async getNotAuthorized() {
        return this.gqlc.query({
            query: gql`query { getNotAuthorized }`
        });
    }

    async getAuthenticationError() {
        return this.gqlc.query({
            query: gql`query { getAuthenticationError }`
        });
    }

    async getUserInputError() {
        return this.gqlc.query({
            query: gql`query { getUserInputError }`
        });
    }

    async getApolloError() {
        return this.gqlc.query({
            query: gql`query { getApolloError }`
        });
    }

    async getUnknownOperation() {
        return this.gqlc.query({
            query: gql`query { getUnknownOperation }`
        });
    }

    async getMultipleErrors() {
        return this.gqlc.query({
            query: gql`query { 
                getNotAuthorized 
                getAuthenticationError 
                getApolloError 
            }`
        });
    }

    async getCustomError() {
        return this.gqlc.query({
            query: gql`query { getCustomError }`
        });
    }

    async getFail() {
        return this.gqlcFail.query({
            query: gql`query { getFail }`
        });
    }

    async getTimeout() {
        return this.gqlc.query({
            query: gql`query { getTimeout }`
        });
    }
}

const errorProvider = new ErrorProvider();
errorProvider.setGqlc(apolloClient);
export default errorProvider;