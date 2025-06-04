<template>
  <div class="login-container">
    <h2>登入</h2>
    <form @submit.prevent="handleLogin">
      <div>
        <label for="username">帳號：</label>
        <input id="username" v-model="username" required autocomplete="username" />
      </div>
      <div>
        <label for="password">密碼：</label>
        <input id="password" type="password" v-model="password" required autocomplete="current-password" />
      </div>
      <button type="submit" :disabled="loading">
        {{ loading ? '登入中...' : '登入' }}
      </button>
      <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
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
  max-width: 320px;
  margin: 100px auto;
  padding: 30px 40px;
  background-color: #000;
  border: 2px solid #fff;
  border-radius: 8px;
  color: #fff;
  font-family: 'Courier New', Courier, monospace;
  box-shadow: 0 0 15px #00ff00aa;
  display: flex;
  flex-direction: column;
  align-items: center; /* 整個容器置中 */
}

h2 {
  margin-bottom: 30px;
  color: #00ff00;
  text-shadow: 0 0 5px #00ff00;
  text-align: center;
}

form {
  width: 100%;
}

form > div {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

label {
  width: 80px; /* 固定寬度，讓輸入框對齊 */
  color: #00ff00;
  font-weight: bold;
  text-shadow: 0 0 4px #00ff00bb;
}

input {
  flex: 1; /* 填滿剩餘空間 */
  padding: 10px 12px;
  background-color: transparent;
  border: 2px solid #00ff00;
  border-radius: 4px;
  color: #fff;
  font-size: 16px;
  font-family: 'Courier New', Courier, monospace;
  outline: none;
  transition: border-color 0.3s;
}

input::placeholder {
  color: #33ff33aa;
}

input:focus {
  border-color: #33ff33;
  box-shadow: 0 0 8px #33ff33;
}

button {
  width: 100%;
  padding: 12px;
  background-color: transparent;
  border: 2px solid #00ff00;
  border-radius: 4px;
  color: #00ff00;
  font-size: 18px;
  font-weight: bold;
  font-family: 'Courier New', Courier, monospace;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

button:not(:disabled):hover {
  background-color: #00ff00;
  color: #000;
  box-shadow: 0 0 12px #00ff00;
}

.error-msg {
  margin-top: 10px;
  color: #ff4c4c;
  font-weight: bold;
  text-align: center;
  text-shadow: 0 0 5px #ff4c4cbb;
}
</style>

