import Home from '../pages/HomePage/HomePage.vue'
import About from '../pages/AboutPage/AboutPage.vue'
import ServerStatus from '../pages/ServerStatusPage/ServerStatusPage'

const routes = [
    {name: "home", path: '/', component: Home},
    {name: "about", path: '/about', component: About},
    {name: "serverStatus", path: '/server-status', component: ServerStatus},

]

export default routes