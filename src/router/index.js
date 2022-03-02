import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Edit from '@/views/Edit.vue'
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
        component: Edit
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
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "2nd-patch" */ '../views/Login.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
