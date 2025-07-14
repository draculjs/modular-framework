import queueFindRaw from './gql/queueFind.graphql?raw';
import queueFindByTopicAndStateRaw from './gql/queueFindByTopicAndState.graphql?raw';
import queueFetchRaw from './gql/queueFetch.graphql?raw';
import queuePaginateRaw from './gql/queuePaginate.graphql?raw';
import queueCreateRaw from './gql/queueCreate.graphql?raw';
import queueUpdateRaw from './gql/queueUpdate.graphql?raw';
import queueDeleteRaw from './gql/queueDelete.graphql?raw';
import { ApolloClient, gql } from '@apollo/client/core';

const queueFindGql = gql(queueFindRaw);
const queueFindByTopicAndStateGql = gql(queueFindByTopicAndStateRaw);
const queueFetchGql = gql(queueFetchRaw);
const queuePaginateGql = gql(queuePaginateRaw);
const queueCreateGql = gql(queueCreateRaw);
const queueUpdateGql = gql(queueUpdateRaw);
const queueDeleteGql = gql(queueDeleteRaw);

class QueueProvider {
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

    findQueue(id) {
        return this.getGqlClient().query({
            query: queueFindGql,
            variables: { id },
            fetchPolicy: "network-only"
        });
    }

    queueFindByTopicAndState(topic, state) {
        return this.getGqlClient().query({
            query: queueFindByTopicAndStateGql,
            variables: { topic, state },
            fetchPolicy: "network-only"
        });
    }

    fetchQueues() {
        return this.getGqlClient().query({ 
            query: queueFetchGql 
        });
    }

    paginateQueues(pageNumber, itemsPerPage, search = null, orderBy = null, orderDesc = false) {
        return this.getGqlClient().query({
            query: queuePaginateGql,
            variables: { pageNumber, itemsPerPage, search, orderBy, orderDesc },
            fetchPolicy: "network-only"
        });
    }

    createQueue(form) {
        return this.getGqlClient().mutate({
            mutation: queueCreateGql,
            variables: form
        });
    }

    updateQueue(form) {
        return this.getGqlClient().mutate({
            mutation: queueUpdateGql,
            variables: form
        });
    }

    deleteQueue(id) {
        return this.getGqlClient().mutate({
            mutation: queueDeleteGql,
            variables: { id }
        });
    }
}

export default new QueueProvider();