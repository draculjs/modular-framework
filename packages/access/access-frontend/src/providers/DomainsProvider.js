class DomainsProviders {
    constructor() {
        this.gqlc = null
    }

    setGqlc(gqlc) {
        this.gqlc = gqlc
    }

    findDomain(id) {
        return this.gqlc.query({
            query: require('./gql/findDomain.graphql'),
            fetchPolicy: "network-only",
            variables: {id:id}
        })
    }

    createDomain({value, enable}) {
        return this.gqlc.mutate({
            mutation: require('./gql/createDomain.graphql'),
            variables: {input: {value, enable}}
        })
    }

    paginateDomain({pageNumber, itemsPerPage, search, orderBy, orderDesc}){
        return this.gqlc.query({
            query: require('./gql/paginateDomain.graphql'),
            fetchPolicy: "network-only",
            variables: {pageNumber, itemsPerPage, search, orderBy, orderDesc}
        })
    }

    updateDomain({id, value, enable}){
        return this.gqlc.mutate({
            mutation: require('./gql/updateDomain.graphql'),
            variables: {id, input: {value, enable}}
        })
    }

    deleteDomain({id}){
        return this.gqlc.mutate({
            mutation: require('./gql/deleteDomain.graphql'),
            variables: {id}
        })
    }
    
}

export default new DomainsProviders()


