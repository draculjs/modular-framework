import paginateAuditRaw from './gql/Audit/paginateAudit.graphql?raw';
import createAuditRaw from './gql/Audit/createAudit.graphql?raw';
import fetchAuditRaw from './gql/Audit/fetchAudit.graphql?raw';
import findAuditRaw from './gql/Audit/findAudit.graphql?raw';
import { ApolloClient, gql } from '@apollo/client/core';

const paginateAuditGql = gql(paginateAuditRaw);
const createAuditGql = gql(createAuditRaw);
const fetchAuditGql = gql(fetchAuditRaw);
const findAuditGql = gql(findAuditRaw);

class AuditProvider {
    constructor() {
        this.graphqlClient = null;
    }

    setGqlc(graphqlClient) {
        if (graphqlClient instanceof ApolloClient) {
            this.graphqlClient = graphqlClient;
        } else {
            throw new Error('graphqlClient must be an ApolloClient instance');
        }
    }

    getGraphqlClient() {
        if (this.graphqlClient === null) {
            throw new Error('graphqlClient must be initialized');
        } else {
            return this.graphqlClient;
        }
    }

    findAudit(id) {
        return this.getGraphqlClient().query({
            query: findAuditGql,
            variables: { id }
        });
    }

    fetchAudit() {
        return this.getGraphqlClient().query({ 
            query: fetchAuditGql 
        });
    }

    paginateAudit(pageNumber, itemsPerPage, search = null, filters = null, orderBy = null, orderDesc = false) {
        return this.getGraphqlClient().query({
            query: paginateAuditGql,
            variables: { pageNumber, itemsPerPage, search, filters, orderBy, orderDesc },
            fetchPolicy: "network-only"
        });
    }

    createAudit(action, entity, details, changes, resourceData, resourceName) {
        return this.getGraphqlClient().mutate({
            mutation: createAuditGql,
            variables: { action, entity, details, changes, resourceData, resourceName },
            fetchPolicy: "no-cache"
        });
    }
}

export default new AuditProvider();