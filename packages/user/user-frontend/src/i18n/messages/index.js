import merge from 'deepmerge'
import UserMessages from './user-messages'
import GroupMessages from './group-messages'
import RoleMessages from './role-messages'
import AuthMessages from './auth-messages'
import AuditMessages from './audit-messages'
import MetricsMessages from './metrics-messages'
import SessionMessages from './session-messages'
import ValidationMessages from './validation-messages'
import ErrorMessages from './error-messages'

const messages = merge.all([
    UserMessages,
    GroupMessages,
    RoleMessages,
    AuthMessages,
    AuditMessages,
    MetricsMessages,
    SessionMessages,
    ValidationMessages,
    ErrorMessages
])

export default messages
