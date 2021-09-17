import {types, resolvers} from './graphql'
import * as permissions from './permissions'
import {fetchQueues,paginateQueues,findQueue,deleteQueue} from './services/QueueService'

export {
    //permissions
    permissions,

    //Graphql
    types,
    resolvers,

    //Services
    fetchQueues,paginateQueues,findQueue,deleteQueue
}
