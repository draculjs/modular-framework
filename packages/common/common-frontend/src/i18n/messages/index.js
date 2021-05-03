import merge from 'deepmerge'
import commonMessages from './common-messages'
import vuetifyMessages from './vuetify-messages'
import clientMessages from './client-messages'
import errorMessages from './error-messages'
import multiLangMessages from './multilang-messages'

const messages = merge.all([commonMessages, multiLangMessages,  vuetifyMessages, clientMessages, errorMessages])

export default messages
