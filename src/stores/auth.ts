import axios from 'axios'
import { defineStore } from 'pinia'
import { BaseResponse } from '@/models/BaseResponse' // 確保 tsconfig 有正確 paths 設定

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

interface LoginData {
  id: number
  username: string
  roles: string[]
  token: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as LoginData | null,
    token: '',
  }),
  actions: {
    async login(username: string, password: string) {
      try {
        const response = await axios.post<BaseResponse<LoginData>>(`${apiBaseUrl}/api/Auth/login`, {
          username,
          password,
        })

        const result = response.data

        if (result.code === 200 && result.data) {
          this.token = result.data.token
          this.user = {
            id: result.data.id,
            username: result.data.username,
            roles: result.data.roles,
            token: result.data.token,
          }

          localStorage.setItem('token', this.token)
          localStorage.setItem('user', JSON.stringify(this.user))
        } else {
          throw new Error(result.message || '登入失敗')
        }
      } catch (error: any) {
        const message =
          error?.response?.data?.message || error?.message || '登入失敗'
        throw new Error(message)
      }
    },
    logout() {
      this.user = null
      this.token = ''
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
    initialize() {
      const savedToken = localStorage.getItem('token')
      const savedUser = localStorage.getItem('user')

      this.token = savedToken || ''
      this.user = savedUser ? JSON.parse(savedUser) : null
    },
  },
})
