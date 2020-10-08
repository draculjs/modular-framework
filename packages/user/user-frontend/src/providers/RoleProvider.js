class RoleProvider {
    constructor() {
        this.gqlc = null
    }

    setGqlc(gqlc){
        this.gqlc = gqlc
    }

    permissions() {
        return this.gqlc.query({
            query: require('./gql/permissions.graphql'),
            fetchPolicy: "network-only"
        })
    }

    roles() {
        return this.gqlc.query({
            query: require('./gql/roles.graphql'),
            fetchPolicy: "network-only"
        })
    }
    
    role(id) {
        return this.gqlc.query({
            query: require('./gql/role.graphql'),
            variables: {id:id},
            fetchPolicy: "network-only"
        })
    }
    
    roleCreate(form) {
        return this.gqlc.mutate({
            mutation: require('./gql/roleCreate.graphql'),
            variables: { name: form.name, childRoles: form.childRoles,  permissions: form.permissions }
        })
    }
    
    roleUpdate(form) {
        return this.gqlc.mutate({
            mutation: require('./gql/roleUpdate.graphql'),
            variables: { id: form.id, name: form.name, childRoles: form.childRoles,  permissions: form.permissions }
        })
    }
    
     roleDelete(id) {
        return this.gqlc.mutate({
            mutation: require('./gql/roleDelete.graphql'),
            variables: {id}
        })
    }

}

const roleProvider = new RoleProvider()

export default roleProvider



