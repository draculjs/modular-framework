import AuditPage from '../pages/crud/'

const routes = [
       
     {
        name: 'Audit', 
        path: '/audit', 
        component: AuditPage,  
        meta: {
            requiresAuth: true,
            permission: "AUDIT_SHOW"
        }
     }
]

export default routes;
