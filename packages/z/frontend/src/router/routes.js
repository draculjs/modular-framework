import merge from 'deepmerge'
import baseRoutes from '../modules/base/routes'

import {routes as userRoutes} from '@dracul/user-frontend'
import {routes as customRoutes} from '@dracul/customize-frontend'
import {routes as notificationRoutes} from '@dracul/notification-frontend'
import {routes as settingsRoutes} from '@dracul/settings-frontend'

const routes = merge.all([baseRoutes, userRoutes, notificationRoutes, customRoutes, settingsRoutes])


export default routes;
