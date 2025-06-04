<template>
  <div class="dashboard-container">
    <h1>後台首頁</h1>
    <p>歡迎回來，<span class="username">{{ username }}</span>！</p>
    <button @click="logout">登出</button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = computed(() => authStore.username || '使用者')

function logout() {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.dashboard-container {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  background-color: #000000; /* 純黑背景 */
  color: #00ff00; /* 駭客綠字體 */
  border: 1px solid #00ff00; /* 綠色邊框 */
  border-radius: 8px;
  text-align: center;
  font-family: 'Courier New', Courier, monospace; /* 打字機字體 */
  user-select: none;
}

.username {
  font-weight: bold;
  color: #00ff00;
  text-shadow: 0 0 5px #00ff00;
}

button {
  margin-top: 20px;
  background-color: transparent;
  border: 1px solid #00ff00;
  color: #00ff00;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Courier New', Courier, monospace;
  transition: background-color 0.3s, color 0.3s;
}

button:hover {
  background-color: #00ff00;
  color: #000000;
}
</style>
