import merge from 'deepmerge'

import DomainMessages from './messages/DomainMessages'
import IpMessages from './messages/IpMessages'

const messages = merge.all([
    DomainMessages,
    IpMessages
])

export default messages;
