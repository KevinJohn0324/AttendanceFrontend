<template>
  <el-container style="height: 100vh;">
    <!-- 側邊欄 -->
    <el-aside width="220px" style="background-color: #000; color: #00ff00;">
      <h2 style="text-align:center; margin-bottom: 20px; color:#00ff00;">考勤系統</h2>
      <el-menu :default-active="activeMenu" background-color="#000" text-color="#00ff00" active-text-color="#00ff00"
        router @select="goTo" style="border-right: none;">
        <el-menu-item index="home">首頁</el-menu-item>
        <el-menu-item index="employees">員工資料</el-menu-item>
        <el-sub-menu index="leave">
          <template #title>假單管理</template>
          <el-menu-item index="leave/myLeave">個人假單紀錄</el-menu-item>
          <el-menu-item index="leave/review">假單審核</el-menu-item>
          <el-menu-item index="leave/types">假單種類管理</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>

    <!-- 主內容 -->
    <el-container>
      <el-header
        style="display:flex; justify-content:space-between; align-items:center; background-color:#121212; color:#00ff00; border-bottom: 1px solid #00ff00; padding: 0 20px;">
        <div style="font-weight:bold;">{{ currentTime }}</div>
        <div style="display:flex; align-items:center; gap: 15px;">
          <span style="font-weight:bold;">{{ username }}</span>
          <el-button size="medium" type="warning" @click="logout">登出</el-button>
        </div>
      </el-header>

      <el-main style="background-color: #121212; color:#00ff00; padding: 20px;">
        <slot />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// 顯示的使用者名稱
const username = computed(() => authStore.user?.username || '使用者')

// 選單選擇狀態
const activeMenu = ref(route.path.includes('employees') ? 'employees' : 'home')
function goTo(page) {
  activeMenu.value = page
  router.push(page === 'home' ? '/dashboard' : `/${page}`)
}

// 登出動作
function logout() {
  authStore.logout()
  router.push('/login')
}

// 顯示時間
const currentTime = ref('')
function updateTime() {
  const d = new Date()
  currentTime.value = d.toLocaleTimeString('zh-TW', { hour12: false })
}
onMounted(() => {
  updateTime()
  setInterval(updateTime, 1000)
})
</script>
