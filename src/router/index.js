import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'
const Login = () =>
    import ('../components/Login')
const Home = () =>
    import ('../components/Home')
const Welcome = () =>
    import ('../components/Welcome')
const Users = () =>
    import ('../components/user/Users')
const Rights = () =>
    import ('../components/power/Rights')
const Roles = () =>
    import ('../components/power/Roles')

Vue.use(VueRouter)

const routes = [{
        path: '/login',
        component: Login
    },
    {
        path: '',
        redirect: '/login'
    },
    {
        path: '/home',
        component: Home,
        redirect: '/welcome',
        children: [{
                path: '/welcome',
                component: Welcome,
            },
            {
                path: '/users',
                component: Users
            },
            {
                path: '/rights',
                component: Rights
            },
            {
                path: '/roles',
                component: Roles
            }
        ]
    }

]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to, from, next) => {
    if (to.path === '/login') return next();
    const tokenStr = window.sessionStorage.getItem('token');
    if (!tokenStr) return next('/login');
    next();
})

export default router