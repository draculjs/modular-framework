class SessionProvider {
    constructor() {
        this.gqlc = null
    }

    setGqlc(gqlc){
        this.gqlc = gqlc
    }

    sessionsByUser() {
        return  this.gqlc.query({query: require('./gql/sessionsByUser.graphql'), fetchPolicy:"network-only"})
    }

    dashboardData() {
        return  this.gqlc.query({query: require('./gql/dashboardData.graphql'), fetchPolicy:"network-only"})
    }
    


}
const sessionProvider = new SessionProvider()
export default sessionProvider


