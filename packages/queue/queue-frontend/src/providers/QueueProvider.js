
class QueueProvider {

    constructor() {
        this.gqlc = null
    }

    setGqlc(gqlc){
        this.gqlc = gqlc
    }

    findQueue(id) {
        return this.gqlc.query({
            query: require('./gql/queueFind.graphql'),
            variables: {id:id}
        })
    }

    fetchQueues() {
        return this.gqlc.query({query: require('./gql/queueFetch.graphql')})
    }

    paginateQueues(pageNumber, itemsPerPage, search = null,  orderBy = null, orderDesc = false) {
        return this.gqlc.query({
            query: require('./gql/queuePaginate.graphql'),
            variables: {pageNumber, itemsPerPage, search, orderBy, orderDesc},
            fetchPolicy: "network-only"
        })
    }



    createQueue(form) {
        return this.gqlc.mutate({
            mutation: require('./gql/queueCreate.graphql'),
            variables: form
        })
    }

    updateQueue(form) {
        return this.gqlc.mutate({
            mutation: require('./gql/queueUpdate.graphql'),
            variables: form
        })
    }

     deleteQueue(id) {
        return this.gqlc.mutate({
            mutation: require('./gql/queueDelete.graphql'),
            variables: {id}
        })
    }

}

export default new QueueProvider()

