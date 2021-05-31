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
            variables: {id:id}
        })
    }

    findSettingsByKey(key) {
        return this.gqlc.query({
            query: require('./gql/settingsFindByKey.graphql'),
            variables: {key}
        })
    }

    fetchSettings() {
        return this.gqlc.query({query: require('./gql/settingsFetch.graphql')})
    }

    paginateSettings(pageNumber, itemsPerPage, search = null,  orderBy = null, orderDesc = false) {
        return this.gqlc.query({
            query: require('./gql/settingsPaginate.graphql'),
            variables: {pageNumber, itemsPerPage, search, orderBy, orderDesc},
            fetchPolicy: "network-only"
        })
    }



    createSettings(form) {
        return this.gqlc.mutate({
            mutation: require('./gql/settingsCreate.graphql'),
            variables: form
        })
    }

    updateSettings(form) {
        return this.gqlc.mutate({
            mutation: require('./gql/settingsUpdate.graphql'),
            variables: form
        })
    }

     deleteSettings(id) {
        return this.gqlc.mutate({
            mutation: require('./gql/settingsDelete.graphql'),
            variables: {id}
        })
    }

}

export default new SettingsProvider()


