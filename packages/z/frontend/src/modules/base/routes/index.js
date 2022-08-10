import Home from '../pages/HomePage/HomePage.vue'
import About from '../pages/AboutPage/AboutPage.vue'
import ServerStatus from '../pages/ServerStatusPage'
import ServerTimeout from '../pages/ServerTimeoutPage'
import ErrorSamplePage from '../pages/ErrorSamplePage'

const routes = [
    {name: "root",  path: '/', redirect: {name: 'home'}},
    {name: "home", path: '/home', component: Home},
    {name: "about", path: '/about', component: About},
    {name: "serverStatus", path: '/server-status', component: ServerStatus},
    {name: "serverTimeout", path: '/server-timeout', component: ServerTimeout},
    {name: "errorSample", path: '/error-sample', component: ErrorSamplePage},

]

export default routes
