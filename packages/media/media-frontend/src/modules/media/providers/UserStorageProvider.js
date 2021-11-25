class UserStorageProvider {

    constructor() {
        this.gqlc = null
    }

    setGqlc(gqlc) {
        this.gqlc = gqlc
    }


    fetchUserStorage() {
        return this.gqlc.query({
            query: require('./gql/userStorageFetch.graphql'),
            fetchPolicy: "network-only"
        })
    }

    findUserStorageByUser() {
        return this.gqlc.query({
            query: require('./gql/userStorageFindByUser.graphql'),
            fetchPolicy: "network-only"
        })
    }

    updateUserStorage(form) {
        return this.gqlc.mutate({
            mutation: require('./gql/userStorageUpdate.graphql'),
            variables: form,
            fetchPolicy: "no-cache"
        })
    }
}

export default new UserStorageProvider()
