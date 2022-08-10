import apolloClient from '../../../apollo'
class BaseProvider {

    constructor() {
        this.gqlc = null
    }

    setGqlc(gqlc){
        this.gqlc = gqlc
    }

    ping(){
        return this.gqlc.query({
            query: require('./gql/ping.graphql')
        })
    }

    pingTimeout(){
        return this.gqlc.query({
            query: require('./gql/pingTimeout.graphql')
        })
    }
}
const baseProvider = new BaseProvider()
baseProvider.setGqlc(apolloClient)
export default baseProvider
