class QueueStatsProvider {

    constructor() {
        this.gqlc = null
    }

    setGqlc(gqlc){
        this.gqlc = gqlc
    }


    queueStats() {
        return this.gqlc.query({
            query: require('./gql/queueStats.graphql')
        })
    }




}

const queueStatsProvider = new QueueStatsProvider()

export default queueStatsProvider

