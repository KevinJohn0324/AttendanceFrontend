import axios from 'axios'
import { defineStore } from 'pinia'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: '',
  }),
  actions: {
    async login(username, password) {
      try {
        const response = await axios.post(`${apiBaseUrl}/api/Auth/login`, {
          username,
          password,
        })

        if (response.data.code === 200) {
          this.token = response.data.data.token
          this.user = {
            id: response.data.data.id,
            username: response.data.data.username,
            roles: response.data.data.roles,
          }
          localStorage.setItem('token', this.token)
          localStorage.setItem('user', JSON.stringify(this.user))
        } else {
          throw new Error(response.data.message || '登入失敗')
        }
      } catch (error) {
        throw new Error(error.response?.data?.message || error.message || '登入失敗')
      }
    },
    logout() {
      this.user = null
      this.token = ''
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
    initialize() {
      this.token = localStorage.getItem('token') || ''
      this.user = JSON.parse(localStorage.getItem('user')) || null
    },
  },
})
