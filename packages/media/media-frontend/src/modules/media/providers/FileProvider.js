import graphqlClient from "../../../apollo";

class FileProvider {

    constructor() {
        this.gqlc = graphqlClient
    }

    setGqlc(gqlc){
        this.gqlc = gqlc
    }

    findFile(id) {
        return this.gqlc.query({
            query: require('./gql/fileFind.graphql'),
            variables: {id:id}
        })
    }

    fetchFiles() {
        return this.gqlc.query({query: require('./gql/fileFetch.graphql')})
    }
    
    paginateFiles(pageNumber, itemsPerPage, search = null,  orderBy = null, orderDesc = false) {
        return this.gqlc.query({
            query: require('./gql/filePaginate.graphql'),
            variables: {pageNumber, itemsPerPage, search, orderBy, orderDesc},
            fetchPolicy: "network-only"
        })
    }
    

    updateFile(form) {
        return this.gqlc.mutate({
            mutation: require('./gql/fileUpdate.graphql'),
            variables: form
        })
    }
    
     deleteFile(id) {
        return this.gqlc.mutate({
            mutation: require('./gql/fileDelete.graphql'),
            variables: {id}
        })
    }

}

const fileProvider = new FileProvider()

export default fileProvider

