import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Register from '../components/Register.vue'
import ShareFileSecret from '../components/ShareFileSecret.vue'

// const Login = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Login.vue')
// const Home = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Home.vue')
// const Register = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Register.vue')

Vue.use(VueRouter)

const routes = [
  {path: '/', redirect: '/login'},
  {path: '/login', component: Login},
  {path: '/home', component: Home},
  {path: '/register', component: Register},
  // 动态路径参数 以冒号开头
  { path: '/shareFileSecret', component: ShareFileSecret }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫,to表示将要访问的路径，from表示从哪里来，next是下一个要做的操作 next('/login')强制跳转login
router.beforeEach((to, from, next) => {
  // 访问登录页，放行
  if (to.path === '/login' || to.path === '/register' ||to.path === '/shareFileSecret') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  // 没有token, 强制跳转到登录页
  if (!tokenStr) return next('/login')
  next()
})

export default router
