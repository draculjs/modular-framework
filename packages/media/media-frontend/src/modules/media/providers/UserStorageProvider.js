import graphqlClient from "../../../apollo";

class userStorageProvider {
    fetchUserStorage() {
        return graphqlClient.query({
            query: require('./gql/userStorageFetch.graphql'),
            fetchPolicy: "network-only"
        })
    }

    findUserStorageByUser() {
        return graphqlClient.query({
            query: require('./gql/userStorageFindByUser.graphql'),
            fetchPolicy: "network-only"
        })
    }

    updateUserStorage(form) {
        return graphqlClient.mutate({
            mutation: require('./gql/userStorageUpdate.graphql'),
            variables: form,
            fetchPolicy: "no-cache"
        })
    }
}

export default new userStorageProvider()
