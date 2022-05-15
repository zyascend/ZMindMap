import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store/user'
import Home from '@/views/Home.vue'
import Folder from '@/views/Folder.vue'
import NotFound from '@/views/NotFound.vue'

const routes = [
  {
    path: '/',
    redirect: '/app'
  },
  {
    path: '/app',
    name: 'Home',
    component: Home,
    redirect: '/app/folder',
    children: [
      {
        path: 'edit/:id',
        component: () => import(/* webpackChunkName: "edit-patch" */ '@/views/Edit.vue')
      },
      {
        path: 'folder/:id?',
        component: Folder
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    meta: {
      isLogin: true
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "login-patch" */ '../views/Login.vue')
  },
  {
    path: '/404',
    component: NotFound
  },
  {
    path: '/:catchAll(.*)', // 不识别的path自动匹配404
    redirect: '/404'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})
router.beforeEach((to, from, next) => {
  // 百度统计
  if (to.path && window._hmt) {
    window._hmt.push(['_trackPageview', to.fullPath])
  }
  const store = useUserStore()
  if (to.meta.isLogin) {
    // 如果去登陆页的话 不用验证token
    next()
  } else {
    // 验证是否登录了
    if (store?.token || localStorage.getItem('token')) {
      next()
    } else {
      next({ path: '/login', query: { redirect: to.path } })
    }
  }
})

export default router
