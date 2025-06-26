// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import { useAuthStore } from '@/stores/auth'

const Dashboard = () => import('../views/dashboard/index.vue')
const EmployeeList = () => import('../views/employees/EmployeeListView.vue')
const MyLeaves = () => import('../views/leaves/MyLeaveRecords.vue')
const ApprovalLeaves = () => import('../views/leaves/ApprovalLeaves.vue')

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: '/employees',
    component: EmployeeList,
    meta: { requiresAuth: true },
  },
  {
    path: '/leave',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'myLeave',
        component: MyLeaves,
        meta: { requiresAuth: true },
      },
      {
        path: 'ApprovalLeave',
        component: ApprovalLeaves,
        meta: { requiresAuth: true },
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})


router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // 初始化 Pinia 狀態（防止刷新後狀態遺失）
  authStore.initialize()

  if (to.meta.requiresAuth && !authStore.token) {
    // 如果該頁需要登入但沒登入，導去 login
    next('/login')
  } else {
    next()
  }
})

export default router
