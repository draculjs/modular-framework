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

    fetchEntityOptions(entity, field) {
        return this.gqlc.query({
            query: require('./gql/fetchEntityOptions.graphql'),
            variables: {entity, field},
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

    settingValueUpdateByKey(key,value) {
        return this.gqlc.mutate({
            mutation: require('./gql/settingValueUpdateByKey.graphql'),
            variables: {key,value}
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


