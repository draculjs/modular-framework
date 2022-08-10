class GroupProvider {

    constructor() {
        this.gqlc = null
    }

    setGqlc(gqlc){
        this.gqlc = gqlc
    }

    groups() {
        return this.gqlc.query({
            query: require('./gql/groups.graphql'),
            fetchPolicy: "network-only"
        })
    }

    myGroups() {
        return this.gqlc.query({
            query: require('./gql/myGroups.graphql'),
            fetchPolicy: "network-only"
        })
    }

    paginateGroups(limit, pageNumber, search = null, orderBy = null, orderDesc = false, myGroups= false) {
        return this.gqlc.query({
            query: require('./gql/groupsPaginate.graphql'),
            variables: {limit, pageNumber, search, orderBy, orderDesc, myGroups},
            fetchPolicy: "network-only"
        })
    }

    group(id) {
        return this.gqlc.query({
            query: require('./gql/group.graphql'),
            variables: {id:id},
            fetchPolicy: "network-only"
        })
    }

    groupByName(name) {
        return this.gqlc.query({
            query: require('./gql/groupByName.graphql'),
            variables: {name},
            fetchPolicy: "network-only",
        })
    }

    createGroup(form) {
        return this.gqlc.mutate({
            mutation: require('./gql/groupCreate.graphql'),
            variables: form
        })
    }

    updateGroup(form) {
        return this.gqlc.mutate({
            mutation: require('./gql/groupUpdate.graphql'),
            variables: form
        })
    }

     deleteGroup(id) {
        return this.gqlc.mutate({
            mutation: require('./gql/groupDelete.graphql'),
            variables: {id}
        })
    }

}
const groupProvider = new GroupProvider()

export default groupProvider


