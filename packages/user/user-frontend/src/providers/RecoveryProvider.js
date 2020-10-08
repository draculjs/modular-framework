class RecoveryProvider {

    constructor() {
        this.gqlc = null
    }

    setGqlc(gqlc) {
        this.gqlc = gqlc
    }

    validateToken(token) {
        return this.gqlc.mutate({
            mutation: require('./gql/validateToken.graphql'),
            variables: {token: token}
        })
    }

    recoveryByEmail(email) {
        return this.gqlc.mutate({
            mutation: require('./gql/recoveryByEmail.graphql'),
            variables: {email: email}
        })
    }

    recoveryChangePassword(token, newPassword) {
        return this.gqlc.mutate({
            mutation: require('./gql/recoveryChangePassword.graphql'),
            variables: {token: token, newPassword: newPassword}
        })
    }


}

const recoveryProvider = new RecoveryProvider()

export default recoveryProvider