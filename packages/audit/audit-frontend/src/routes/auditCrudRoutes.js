import AuditPage from '../pages/crud/index.vue'

const routes = [
       
     {
        name: 'AuditPage', 
        path: '/audit', 
        component: AuditPage,  
        meta: {
            requiresAuth: true,
            permission: "AUDIT_SHOW"
        }
     }
]

export default routes;
