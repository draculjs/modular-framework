import BaseMessages from './BaseMessages'
import ErrorMessages from './ErrorMessages'
import merge from 'deepmerge'

const messages = merge.all([BaseMessages, ErrorMessages])

export default messages
