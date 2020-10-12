class UploadProvider {


    constructor() {
        this.gqlc = null
    }

    setGqlc(gqlc){
        this.gqlc = gqlc
    }

    uploadFile(file) {
        return this.gqlc.mutate({
            mutation: require('./gql/fileUpload.graphql'),
            variables: {file: file}
        })
    }


}

const uploadProvider =  new UploadProvider()

export default uploadProvider
