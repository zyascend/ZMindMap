import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store/user'
import Home from '../views/Home.vue'
// import Edit from '@/views/Edit.vue'
import Folder from '@/views/Folder.vue'

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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})
router.beforeEach((to, from, next) => {
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
