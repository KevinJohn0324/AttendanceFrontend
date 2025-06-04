<template>
  <div class="login-container">
    <h2>登入</h2>
    <form @submit.prevent="handleLogin">
      <div>
        <label for="username">帳號：</label>
        <input id="username" v-model="username" required />
      </div>
      <div>
        <label for="password">密碼：</label>
        <input id="password" type="password" v-model="password" required />
      </div>
      <button type="submit" :disabled="loading">
        {{ loading ? '登入中...' : '登入' }}
      </button>
      <p v-if="errorMsg" style="color:red;">{{ errorMsg }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

async function handleLogin() {
  errorMsg.value = ''
  loading.value = true
  try {
    await authStore.login(username.value, password.value)
    router.push('/dashboard')  // 登入成功導到後台首頁
  } catch (error) {
    errorMsg.value = error.message || '登入失敗'
    password.value = ''
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  max-width: 300px;
  margin: 100px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 6px;
}
.login-container label {
  display: block;
  margin-bottom: 6px;
}
.login-container input {
  width: 100%;
  padding: 6px;
  margin-bottom: 12px;
  box-sizing: border-box;
}
.login-container button {
  width: 100%;
  padding: 8px;
}
</style>
