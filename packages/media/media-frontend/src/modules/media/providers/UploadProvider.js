import graphqlClient from "../../../apollo";

class UploadProvider {


    constructor() {
        this.gqlc = graphqlClient
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
