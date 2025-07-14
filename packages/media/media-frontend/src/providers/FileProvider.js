import fileFindRaw from './gql/fileFind.graphql?raw';
import fileFetchRaw from './gql/fileFetch.graphql?raw';
import filePaginateRaw from './gql/filePaginate.graphql?raw';
import fileUpdateRaw from './gql/fileUpdate.graphql?raw';
import fileDeleteRaw from './gql/fileDelete.graphql?raw';
import { ApolloClient, gql } from '@apollo/client/core';

const fileFindGql = gql(fileFindRaw);
const fileFetchGql = gql(fileFetchRaw);
const filePaginateGql = gql(filePaginateRaw);
const fileUpdateGql = gql(fileUpdateRaw);
const fileDeleteGql = gql(fileDeleteRaw);

class FileProvider {
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

    findFile(id) {
        return this.getGqlClient().query({
            query: fileFindGql,
            variables: { id }
        });
    }

    fetchFiles() {
        return this.getGqlClient().query({ query: fileFetchGql });
    }
    
    paginateFiles(pageNumber, itemsPerPage, search = null, filters, orderBy = null, orderDesc = false) {
        return this.getGqlClient().query({
            query: filePaginateGql,
            variables: {
                input: { pageNumber, itemsPerPage, search, filters, orderBy, orderDesc } 
            },
            fetchPolicy: "network-only"
        });
    }

    updateFile(input, file) {
        return this.getGqlClient().mutate({
            mutation: fileUpdateGql,
            variables: { input, file }
        });
    }
    
    deleteFile(id) {
        return this.getGqlClient().mutate({
            mutation: fileDeleteGql,
            variables: { id }
        });
    }
}

const fileProvider = new FileProvider();
export default fileProvider;