import graphqlClient from "../src/apollo";

class AuditProvider {

    findAudit(id) {
        return graphqlClient.query({
            query: require('./gql/Audit/findAudit.graphql'),
            variables: {id:id}
        })
    }

    fetchAudit() {
        return graphqlClient.query({query: require('./gql/Audit/fetchAudit.graphql')})
    }
    
    paginateAudit(pageNumber, itemsPerPage, search = null, filters = null,  orderBy = null, orderDesc = false) {
        return graphqlClient.query({
            query: require('./gql/Audit/paginateAudit.graphql'),
            variables: {pageNumber, itemsPerPage, search, filters, orderBy, orderDesc},
            fetchPolicy: "network-only"
        })
    }
    
    

    createAudit(input) {
        return graphqlClient.mutate({
            mutation: require('./gql/Audit/createAudit.graphql'),
            variables: {input}
        })
    }
    
    updateAudit(id,input) {
        return graphqlClient.mutate({
            mutation: require('./gql/Audit/updateAudit.graphql'),
            variables: {id, input}
        })
    }
    
     deleteAudit(id) {
        return graphqlClient.mutate({
            mutation: require('./gql/Audit/deleteAudit.graphql'),
            variables: {id}
        })
    }

}

export default new AuditProvider()


