class SettingsProvider {

    constructor() {
        this.gqlc = null
    }

    setGqlc(gqlc) {
        this.gqlc = gqlc
    }


    findSettings(id) {
        return this.gqlc.query({
            query: require('./gql/settingsFind.graphql'),
            fetchPolicy: "network-only",
            variables: {id:id}
        })
    }

    findSettingsByKey(key) {
        return this.gqlc.query({
            query: require('./gql/settingsFindByKey.graphql'),
            fetchPolicy: "network-only",
            variables: {key}
        })
    }

    fetchSettings() {
        return this.gqlc.query({
            query: require('./gql/settingsFetch.graphql'),
            fetchPolicy: "network-only"
        })
    }

    paginateSettings(pageNumber, itemsPerPage, search = null,  orderBy = null, orderDesc = false) {
        return this.gqlc.query({
            query: require('./gql/settingsPaginate.graphql'),
            variables: {pageNumber, itemsPerPage, search, orderBy, orderDesc},
            fetchPolicy: "network-only"
        })
    }

     fetchEntityOptions(key) {
        return this.gqlc.query({
            query: require('./gql/fetchEntityOptions.graphql'),
            variables: {key},
            fetchPolicy: "network-only"
        })
    }

    settingValueUpdateByKey(key,value) {
        return this.gqlc.mutate({
            mutation: require('./gql/settingValueUpdateByKey.graphql'),
            variables: {key,value}
        })
    }



}

export default new SettingsProvider()


