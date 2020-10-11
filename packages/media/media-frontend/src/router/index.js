import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
Vue.use(VueRouter)
import store from '../store'

const router = new VueRouter({
    mode: 'history',
    routes: routes
})

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        // this route requires auth, check if logged in
        // if not, redirect to login page.

        store.dispatch('checkAuth')

        if (!store.getters.isAuth) {

            next({
                path: '/login',
                query: {redirect: to.fullPath}
            })
        } else {

            if (to.meta.role && !store.getters.hasRole(to.meta.role)) {
                next({path: '/', query: {redirect: to.fullPath}})
            } else if (to.meta.permission && !store.getters.hasPermission(to.meta.permission)) {
                next({path: '/', query: {redirect: to.fullPath}})
            }else{
                next()
            }

        }
    } else {
        next() // make sure to always call next()!
    }
})


export default router
