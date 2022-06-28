class UploadProvider {


    constructor() {
        this.gqlc = null
    }

    setGqlc(gqlc) {
        this.gqlc = gqlc
    }

    uploadFile(file, expirationDate, isPublic, description, tags) {
        return this.gqlc.mutate({
            mutation: require('./gql/fileUpload.graphql'),
            variables: { file: file, expirationDate: expirationDate, isPublic: isPublic, description: description, tags: tags}
        })
    }

    uploadFileAnonymous(file) {
        return this.gqlc.mutate({
            mutation: require('./gql/fileUploadAnonymous.graphql'),
            variables: { file: file }
        })
    }
}

const uploadProvider = new UploadProvider()

export default uploadProvider
