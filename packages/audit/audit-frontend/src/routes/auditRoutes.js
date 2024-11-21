import AuditPage from '../pages/AuditPage/index.vue'
import AuditTest from '../pages/TestingPage/index.vue'

const routes = [
       
     {
        name: 'AuditPage', 
        path: '/audit', 
        component: AuditPage,  
        meta: {
            requiresAuth: true,
            permission: "AUDIT_SHOW"
        }
     },
     {
        name: 'AuditTest', 
        path: '/auditTesting', 
        component: AuditTest,  
        meta: {
            requiresAuth: true,
            permission: "AUDIT_SHOW"
        }
     }
]

export default routes;
