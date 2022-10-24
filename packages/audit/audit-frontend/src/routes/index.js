import merge from 'deepmerge'
import crudRoutes from './auditRoutes'

const routes = merge.all([crudRoutes])
export default routes;
