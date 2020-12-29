import merge from 'deepmerge'
import commonMessages from './common-messages'
import vuetifyMessages from './vuetify-messages'
import clientMessages from './client-messages'
import errorMessages from './error-messages'

const messages = merge.all([commonMessages, vuetifyMessages, clientMessages, errorMessages])

export default messages
