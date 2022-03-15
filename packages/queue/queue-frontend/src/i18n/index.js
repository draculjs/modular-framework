import merge from 'deepmerge'
import queueStatsMessages from './messages/queue-stats-messages'
import queueMessages from './messages/queue-messages'
import QueuePermissionMessages from './permissions/QueuePermissionMessages'

export const index = merge.all([
    queueStatsMessages,
    queueMessages,
    QueuePermissionMessages
])

export default index
