import merge from 'deepmerge'
import baseRoutes from '../modules/base/routes'
import mediaRoutes from '../modules/media/routes'

import {routes as userRoutes} from '@dracul/user-frontend'
import {routes as customRoutes} from '@dracul/customize-frontend'

const routes = merge.all([baseRoutes, mediaRoutes, userRoutes, customRoutes])


export default routes;
