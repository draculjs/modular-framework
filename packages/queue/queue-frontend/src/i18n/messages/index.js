import queueStatsMessages from './queue-stats-messages'
import queueMessages from './queue-messages'
import merge from 'deepmerge'

export const index = merge.all([
    queueStatsMessages,
    queueMessages
])

export default index
