import MongooseQueue from './mongoose-queue'
import QueueModel from './models/QueueModel'
import QueueStatsModel from './models/QueueStatsModel'
import producerManager from './producer-manager'
import workerManager from './worker-manager'

import {
    fetchQueues,
    addJob,
    ackJob,
    errorJob,
    getJob,
    cleanQueue,
    resetQueue
} from './services/QueueService'

import {
    fetchQueueStats,
    incrementAddedStat,
    incrementGottenStat,
    incrementFailedStat,
    incrementDoneStat
} from './services/QueueStatsService'


export default {
    //Queue Services
    fetchQueues,
    addJob,
    ackJob,
    errorJob,
    getJob,
    cleanQueue,
    resetQueue,
    //Queue Stat Services
    fetchQueueStats,
    incrementAddedStat,
    incrementGottenStat,
    incrementFailedStat,
    incrementDoneStat,
    workerManager,
    producerManager,
    QueueStatsModel,
    QueueModel,
    MongooseQueue
}
