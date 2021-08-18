class UserProvider {

    constructor() {
        this.gqlc = null
    }

    setGqlc(gqlc) {
        this.gqlc = gqlc
    }

    paginateUsers(limit, pageNumber, search = null, orderBy = null, orderDesc = false, activeUsers = false) {
        return this.gqlc.query({
            query: require('./gql/userPaginate.graphql'),
            variables: {limit, pageNumber, search, orderBy, orderDesc, activeUsers},
            fetchPolicy: "network-only"
        })
    }

    user(id) {
        return this.gqlc.query({
            query: require('./gql/user.graphql'),
            fetchPolicy: "network-only",
            variables: {id: id}
        })
    }

    users() {
        return this.gqlc.query({
            query: require('./gql/users.graphql'),
            fetchPolicy: "network-only"
        })
    }

    usersByRole(roleName) {
        return this.gqlc.query({
            query: require('./gql/usersByRole.graphql'),
            fetchPolicy: "network-only",
            variables: {roleName: roleName}
        })
    }

    roles() {
        return this.gqlc.query({
            query: require('./gql/roles.graphql'),
            fetchPolicy: "network-only"
        })
    }

    groups() {
        return this.gqlc.query({
                query: require('./gql/groups.graphql'),
                fetchPolicy: "network-only"
            }
        )
    }

    createUser({username, password, name, email, phone, role, groups, active}) {
        return this.gqlc.mutate({
            mutation: require('./gql/userCreate.graphql'),
            variables: {username, password, name, email, phone, role, groups, active}
        })

    }


    updateUser({id, name, username, email, phone, role, groups, active}) {
        return this.gqlc.mutate({
            mutation: require('./gql/userUpdate.graphql'),
            variables: {id, name, username, email, phone, role, groups, active}
        })
    }

    deleteUser(id) {
        return this.gqlc.mutate({
            mutation: require('./gql/userDelete.graphql'),
            variables: {id}
        })
    }

    adminChangePassword(id, password, passwordVerify) {
        return this.gqlc.mutate({
            mutation: require('./gql/userAdminChangePassword.graphql'),
            variables: {id: id, password: password, passwordVerify: passwordVerify}
        })
    }

    adminAvatarUpload(id,file) {
        return this.gqlc.mutate({
            mutation: require('./gql/userAdminChangeAvatar.graphql'),
            variables: {
                id: id,
                file: file
            },
        })
    }
}

const userProvider = new UserProvider()
export default userProvider
