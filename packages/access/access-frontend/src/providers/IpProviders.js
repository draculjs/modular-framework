class IpProviders {
    constructor() {
        this.gqlc = null
    }

    setGqlc(gqlc) {
        this.gqlc = gqlc
    }

    findIp(id) {
        return this.gqlc.query({
            query: require('./gql/findIp.graphql'),
            fetchPolicy: "network-only",
            variables: {id:id}
        })
    }

    createIp({value, enable}) {
        return this.gqlc.mutate({
            mutation: require('./gql/createIp.graphql'),
            variables: {input: {value, enable}}
        })
    }

    paginateIp({pageNumber, itemsPerPage, search, orderBy, orderDesc}){
        return this.gqlc.query({
            query: require('./gql/paginateIp.graphql'),
            fetchPolicy: "network-only",
            variables: {pageNumber, itemsPerPage, search, orderBy, orderDesc}
        })
    }

    updateIp({id, value, enable}){
        return this.gqlc.mutate({
            mutation: require('./gql/updateIp.graphql'),
            variables: {id, input: {value, enable}}
        })
    }

    deleteIp({id}){
        return this.gqlc.mutate({
            mutation: require('./gql/deleteIp.graphql'),
            variables: {id}
        })
    }
    
}

export default new IpProviders()


