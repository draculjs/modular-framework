class FileProvider {

    constructor() {
        this.gqlc = null
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
    
    paginateFiles(pageNumber, itemsPerPage, search = null, filters, orderBy = null, orderDesc = false) {
      return this.gqlc.query({
            query: require('./gql/filePaginate.graphql'),
            variables: {
              input: {
                pageNumber, itemsPerPage, search, filters, orderBy, orderDesc
              } 
            },
            fetchPolicy: "network-only"
        })
    }
    

    updateFile(input) {
        return this.gqlc.mutate({
            mutation: require('./gql/fileUpdate.graphql'),
            variables: {input}
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

