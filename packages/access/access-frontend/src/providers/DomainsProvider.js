import paginateDomainGql from './gql/paginateDomain.graphql';
import createDomainGql from './gql/createDomain.graphql';
import updateDomainGql from './gql/updateDomain.graphql';
import deleteDomainGql from './gql/deleteDomain.graphql';
import findDomainGql from './gql/findDomain.graphql';

class DomainsProviders {
    constructor() {
        this.gqlc = null;
    }

    setGqlc(gqlc) {
        this.gqlc = gqlc;
    }

    findDomain(id) {
        return this.gqlc.query({
            query: findDomainGql,
            fetchPolicy: "network-only",
            variables: { id }
        });
    }

    createDomain({ value, enable }) {
        return this.gqlc.mutate({
            mutation: createDomainGql,
            variables: { input: { value, enable } }
        });
    }

    paginateDomain({ pageNumber, itemsPerPage, search, orderBy, orderDesc }) {
        return this.gqlc.query({
            query: paginateDomainGql,
            fetchPolicy: "network-only",
            variables: { pageNumber, itemsPerPage, search, orderBy, orderDesc }
        });
    }

    updateDomain({ id, value, enable }) {
        return this.gqlc.mutate({
            mutation: updateDomainGql,
            variables: { id, input: { value, enable } }
        });
    }

    deleteDomain({ id }) {
        return this.gqlc.mutate({
            mutation: deleteDomainGql,
            variables: { id }
        });
    }
}

export default new DomainsProviders();