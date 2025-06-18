import axios from 'axios'
import type { BaseResponse } from '@/models/base-response'
import { useAuthStore } from '@/stores/auth'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10000,
})

// 請求攔截器：自動附上 token
api.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`
  }
  return config
})

// 回應攔截器：統一處理後端格式
api.interceptors.response.use(
  (response) => {
    const result = response.data as BaseResponse<any>
    if (result.code === 200) {
      return result.data // 回傳真正的資料
    } else {
      return Promise.reject(new Error(result.message || 'API 錯誤'))
    }
  },
  (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      authStore.logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// 呼叫方法
export async function apiPost<T>(url: string, data?: any): Promise<T> {
  return api.post(url, data) as Promise<T>
}

export async function apiGet<T>(url: string, params?: any): Promise<T> {
  return api.get(url, { params }) as Promise<T>
}

export async function apiPut<T>(url: string, data?: any): Promise<T> {
  return api.put(url, data) as Promise<T>
}
