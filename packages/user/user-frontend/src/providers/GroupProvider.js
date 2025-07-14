import groupsRaw from './gql/groups.graphql?raw';
import myGroupsRaw from './gql/myGroups.graphql?raw';
import groupsPaginateRaw from './gql/groupsPaginate.graphql?raw';
import groupRaw from './gql/group.graphql?raw';
import groupByNameRaw from './gql/groupByName.graphql?raw';
import groupCreateRaw from './gql/groupCreate.graphql?raw';
import groupUpdateRaw from './gql/groupUpdate.graphql?raw';
import groupDeleteRaw from './gql/groupDelete.graphql?raw';
import { ApolloClient, gql } from '@apollo/client/core';

const groupsGql = gql(groupsRaw);
const myGroupsGql = gql(myGroupsRaw);
const groupsPaginateGql = gql(groupsPaginateRaw);
const groupGql = gql(groupRaw);
const groupByNameGql = gql(groupByNameRaw);
const groupCreateGql = gql(groupCreateRaw);
const groupUpdateGql = gql(groupUpdateRaw);
const groupDeleteGql = gql(groupDeleteRaw);

class GroupProvider {
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

    groups() {
        return this.getGqlClient().query({
            query: groupsGql,
            fetchPolicy: "network-only"
        });
    }

    myGroups() {
        return this.getGqlClient().query({
            query: myGroupsGql,
            fetchPolicy: "network-only"
        });
    }

    paginateGroups(limit, pageNumber, search = null, orderBy = null, orderDesc = false, myGroups = false, showDeletedUsers = false) {
        return this.getGqlClient().query({
            query: groupsPaginateGql,
            variables: { limit, pageNumber, search, orderBy, orderDesc, myGroups, showDeletedUsers },
            fetchPolicy: "network-only"
        });
    }

    group(id) {
        return this.getGqlClient().query({
            query: groupGql,
            variables: { id },
            fetchPolicy: "network-only"
        });
    }

    groupByName(name) {
        return this.getGqlClient().query({
            query: groupByNameGql,
            variables: { name },
            fetchPolicy: "network-only"
        });
    }

    createGroup(form) {
        return this.getGqlClient().mutate({
            mutation: groupCreateGql,
            variables: form
        });
    }

    updateGroup(form) {
        return this.getGqlClient().mutate({
            mutation: groupUpdateGql,
            variables: form
        });
    }

    deleteGroup(id) {
        return this.getGqlClient().mutate({
            mutation: groupDeleteGql,
            variables: { id }
        });
    }
}

const groupProvider = new GroupProvider();
export default groupProvider;