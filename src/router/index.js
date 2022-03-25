import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store/index'
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
        // 当 /user/:id/profile 匹配成功
        // UserProfile 将被渲染到 User 的 <router-view> 内部
        path: 'edit/:id',
        component: () => import(/* webpackChunkName: "3rd-patch" */ '@/views/Edit.vue')
      },
      {
        // 当 /user/:id/posts 匹配成功
        // UserPosts 将被渲染到 User 的 <router-view> 内部
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
    component: () => import(/* webpackChunkName: "2nd-patch" */ '../views/Login.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})
router.beforeEach((to, from, next) => {
  if (to.meta.isLogin) {
    // 如果去登陆页的话 不用验证token
    next()
  } else {
    // 验证是否登录了
    if (store?.state?.token || localStorage.getItem('token')) {
      next()
    } else {
      console.log(to)
      next({ path: '/login', query: { redirect: to.path } })
    }
  }
})

export default router
