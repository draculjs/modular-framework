import merge from 'deepmerge'
import baseRoutes from '../modules/base/routes'

import { routes as userRoutes } from '@dracul/user-frontend'
import { routes as customRoutes } from '@dracul/customize-frontend'
import { routes as settingsRoutes } from '@dracul/settings-frontend'
import { routes as mediaRoutes } from '@dracul/media-frontend'
import { routes as auditRoutes } from '@dracul/audit-frontend'

const routes = merge.all([baseRoutes, userRoutes, customRoutes, settingsRoutes, mediaRoutes, auditRoutes])

export default routes;
