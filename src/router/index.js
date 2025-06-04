// router/index.js
import { createRouter, createWebHistory } from 'vue-router'

import Login from '../views/Login.vue'
const Dashboard = () => import('../views/dashboard/index.vue')

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// ✅ 改法：延遲載入 store（避免錯誤）
router.beforeEach((to, from, next) => {
  const { useAuthStore } = require('../stores/auth')
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.token) {
    next('/login')
  } else {
    next()
  }
})

export default router
