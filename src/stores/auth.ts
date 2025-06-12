import { defineStore } from 'pinia'
// 匯入封裝的 API POST 方法
import { apiPost } from '@/utils/api'
// 匯入登入資料的 TypeScript 型別
import type { LoginData } from '@/models/LoginData'

export const useAuthStore = defineStore('auth', {
  // 狀態：用來儲存使用者資訊與 JWT token
  state: () => ({
    user: null as LoginData | null,
    token: '',
  }),
  actions: {
    async login(username: string, password: string) {
      const loginData = await apiPost<LoginData>('/api/Auth/login', {
        username,
        password,
      })

      // 將登入後取得的 token 與 user 資訊存入狀態
      this.token = loginData.token
      this.user = loginData

      // 將登入資訊存入 localStorage，記住登入狀態
      localStorage.setItem('token', this.token)
      localStorage.setItem('user', JSON.stringify(this.user))
    },

    /**
     * 登出方法，清除狀態與 localStorage 中的使用者資訊
     */
    logout() {
      this.user = null
      this.token = ''
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },

    /**
     * 初始化方法，在頁面刷新時載入 localStorage 的使用者資訊
     */
    initialize() {
      this.token = localStorage.getItem('token') || ''
      this.user = JSON.parse(localStorage.getItem('user') || 'null')
    },
  },
})
