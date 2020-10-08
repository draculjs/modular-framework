import merge from 'deepmerge'
import commonMessages from './common-messages'
import vuetifyMessages from './vuetify-messages'
import clientMessages from './client-messages'

const messages = merge.all([commonMessages, vuetifyMessages, clientMessages])

export default messages