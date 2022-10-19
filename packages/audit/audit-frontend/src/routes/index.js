import merge from 'deepmerge'
import crudRoutes from './auditCrudRoutes'

const routes = merge.all([crudRoutes])
export default routes;
