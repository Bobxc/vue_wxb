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
const Goods = () =>
    import ('../components/goods/Goods')
const Params = () =>
    import ('../components/goods/Params')
const Categories = () =>
    import ('../components/goods/Categories')
const Orders = () =>
    import ('../components/orders/Orders')
const Reports = () =>
    import ('../components/reports/Reports')

// 修改路由push方法,阻止重复点击报错
const originalReplace = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalReplace.call(this, location).catch(err => err)
}


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
            },
            {
                path: '/goods',
                component: Goods
            },
            {
                path: '/params',
                component: Params
            },
            {
                path: '/categories',
                component: Categories
            },
            {
                path: '/orders',
                component: Orders
            },
            {
                path: '/reports',
                component: Reports
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