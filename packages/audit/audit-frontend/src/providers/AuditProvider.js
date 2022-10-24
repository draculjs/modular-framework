import {ApolloClient} from 'apollo-client'

class AuditProvider {

    constructor(){
        this.graphqlClient = null
    }

    setGqlc(graphqlClient){
        if(graphqlClient instanceof ApolloClient){
            this.graphqlClient = graphqlClient
        }else{
            throw new Error('graphqlClient must be an ApolloClient instance')
        }
    }

    getGraphqlClient(){
        if (this.graphqlClient === null) {
            throw new Error('graphqlClient must be initialized')
        } else {
            return this.graphqlClient
        }
    }

    findAudit(id) {
        return this.getGraphqlClient().query({
            query: require('./gql/Audit/findAudit.graphql'),
            variables: {id}
        })
    }

    fetchAudit() {
        return this.getGraphqlClient().query({query: require('./gql/Audit/fetchAudit.graphql')})
    }
    
    paginateAudit(pageNumber, itemsPerPage, search = null, filters = null,  orderBy = null, orderDesc = false) {
        return this.getGraphqlClient().query({
            query: require('./gql/Audit/paginateAudit.graphql'),
            variables: {pageNumber, itemsPerPage, search, filters, orderBy, orderDesc},
            fetchPolicy: "network-only"
        })
    }

}

export default new AuditProvider()
