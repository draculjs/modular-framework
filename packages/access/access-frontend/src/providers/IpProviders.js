import paginateIpGql from './gql/paginateIp.graphql';
import createIpGql from './gql/createIp.graphql';
import updateIpGql from './gql/updateIp.graphql';
import deleteIpGql from './gql/deleteIp.graphql';
import findIpGql from './gql/findIp.graphql';

class IpProviders {
    constructor() {
        this.gqlc = null;
    }

    setGqlc(gqlc) {
        this.gqlc = gqlc;
    }

    findIp(id) {
        return this.gqlc.query({
            query: findIpGql,
            fetchPolicy: "network-only",
            variables: { id }
        });
    }

    createIp({ value, enable }) {
        return this.gqlc.mutate({
            mutation: createIpGql,
            variables: { input: { value, enable } }
        });
    }

    paginateIp({ pageNumber, itemsPerPage, search, orderBy, orderDesc }) {
        return this.gqlc.query({
            query: paginateIpGql,
            fetchPolicy: "network-only",
            variables: { pageNumber, itemsPerPage, search, orderBy, orderDesc }
        });
    }

    updateIp({ id, value, enable }) {
        return this.gqlc.mutate({
            mutation: updateIpGql,
            variables: { id, input: { value, enable } }
        });
    }

    deleteIp({ id }) {
        return this.gqlc.mutate({
            mutation: deleteIpGql,
            variables: { id }
        });
    }
}

export default new IpProviders();