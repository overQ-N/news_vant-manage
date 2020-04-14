import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('@/views/Login')
  },
  {
    path: '/index',
    redirect: '/post-list',
    component: () => import('@/views/Index'),
    children: [
      { path: '/post-list', component: () => import('@/components/post/PostList') },
      { path: '/post-release', component: () => import('@/components/post/PostRelease') }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    return next()
  }
  const userJson = JSON.parse(sessionStorage.getItem('news-vant'))
  if (!userJson) {
    return next('/login')
  }
  if (userJson.token && userJson.user.role.type === 'admin') {
    next()
  } else {
    next('/login')
  }
})
export default router
