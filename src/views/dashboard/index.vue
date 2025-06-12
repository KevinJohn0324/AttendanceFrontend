<template>
  <div class="container">
    <!-- 側邊選單 -->
    <aside class="sidebar">
      <h2 class="logo">考勤系統</h2>
      <nav>
        <ul>
          <!-- 點擊切換 active 狀態及頁面 -->
          <li :class="{ active: activeMenu === 'home' }" @click="goTo('home')">首頁</li>
          <li :class="{ active: activeMenu === 'employees' }" @click="goTo('employees')">員工資料</li>
          <li :class="{ active: activeMenu === 'records' }" @click="goTo('records')">打卡紀錄</li>
        </ul>
      </nav>
    </aside>

    <main class="main-content">
      <!-- 頁面上方的工具列 -->
      <header class="topbar">
        <!-- 時間與功能按鈕群組 -->
        <div class="time-action-group">
          <!-- 顯示目前時間 -->
          <div class="time">{{ currentTime }}</div>
          <!-- 打卡與請假按鈕 -->
          <div class="action-buttons">
            <button class="btn-punch">打卡</button>
            <button class="btn-leave">請假</button>
          </div>
        </div>

        <!-- 使用者資訊與登出按鈕 -->
        <div class="user-info">
          <span class="username">{{ username }}</span>
          <button @click="logout">登出</button>
        </div>
      </header>

      <!-- 月曆區塊 -->
      <section class="calendar">
        <!-- 顯示當前年月 -->
        <h3>{{ year }} 年 {{ month }} 月</h3>
        <!-- 月曆格子容器 -->
        <div class="calendar-grid">
          <!-- 星期名稱列 -->
          <div class="day-name" v-for="day in dayNames" :key="day">{{ day }}</div>
          <!-- 空白格，補齊第一天前的空格 -->
          <div v-for="blank in blanks" :key="'b' + blank" class="calendar-day blank"></div>
          <!-- 日期格子，當天加上 today 樣式 -->
          <div
            v-for="day in daysInMonthArr"
            :key="day"
            class="calendar-day"
            :class="{ today: isToday(day) }"
          >
            <div class="date-number">{{ day }}</div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
// 引入 Vue 相關函式與 router、store
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// 從 store 取得使用者名稱，若沒有則顯示預設字串
const username = computed(() => authStore.username || '使用者')

// 頁面目前 active 的選單項目，預設首頁
const activeMenu = ref('home')
// 切換頁面與選單狀態
function goTo(page) {
  activeMenu.value = page
}

// 登出函式，呼叫 store 的 logout 並導向登入頁
function logout() {
  authStore.logout()
  router.push('/login')
}

// 取得當前年月及星期名稱
const now = new Date()
const year = now.getFullYear()
const month = now.getMonth() + 1
const dayNames = ['日', '一', '二', '三', '四', '五', '六']

// 計算該月總天數函式
function daysInMonth(y, m) {
  return new Date(y, m, 0).getDate()
}

const daysInMonthValue = daysInMonth(year, month)

// 該月第一天星期幾 (0=日, 1=一, ...)
const firstDay = new Date(year, month - 1, 1).getDay()
// 補齊第一天之前的空白格數組，用於月曆排版
const blanks = Array.from({ length: firstDay }, (_, i) => i + 1)
// 該月日期數組，從1開始
const daysInMonthArr = Array.from({ length: daysInMonthValue }, (_, i) => i + 1)

// 判斷是否為今天，方便加樣式突出
function isToday(day) {
  const today = new Date()
  return (
    day === today.getDate() &&
    month === today.getMonth() + 1 &&
    year === today.getFullYear()
  )
}

// 儲存目前時間字串，並每秒更新
const currentTime = ref('')
function updateTime() {
  const d = new Date()
  // 使用24小時制，不帶上午下午
  currentTime.value = d.toLocaleTimeString('zh-TW', { hour12: false })
}

// 初始化與定時更新時間
onMounted(() => {
  updateTime()
  setInterval(updateTime, 1000)
})
</script>

<style scoped>
/* 主容器：側邊欄 + 主內容排列 */
.container {
  display: flex;
  height: 100vh;
  font-family: 'Courier New', Courier, monospace;
  background-color: #121212;
  color: #00ff00;
  user-select: none; /* 禁止文字選取 */
}

/* 側邊欄 */
.sidebar {
  width: 200px;
  background-color: #000;
  border-right: 1px solid #00ff00;
  display: flex;
  flex-direction: column;
  padding: 20px 0;
}

/* LOGO 樣式 */
.logo {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 30px;
  text-shadow: 0 0 8px #00ff00;
}

/* 側邊欄選單 */
.sidebar nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* 選單項目 */
.sidebar nav ul li {
  padding: 12px 20px;
  cursor: pointer;
  border-left: 4px solid transparent;
  transition: background-color 0.3s, border-color 0.3s;
}

/* 選單滑鼠懸停效果 */
.sidebar nav ul li:hover {
  background-color: #003300;
}

/* 選中狀態 */
.sidebar nav ul li.active {
  border-left-color: #00ff00;
  background-color: #004400;
  font-weight: bold;
}

/* 主內容區 */
.main-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  background-color: #121212;
  padding: 20px;
}

/* 頂部工具列 */
.topbar {
  display: flex;
  justify-content: space-between; /* 左右分開 */
  align-items: center;
  padding-bottom: 15px;
  border-bottom: 1px solid #00ff00;
  font-size: 16px;
  gap: 20px;
}

/* 時間與按鈕群組 */
.time-action-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* 顯示時間樣式 */
.time {
  font-weight: bold;
  letter-spacing: 2px;
  text-shadow: 0 0 5px #00ff00;
  flex-shrink: 0; /* 不縮小 */
}

/* 打卡、請假按鈕容器 */
.action-buttons {
  display: flex;
  gap: 10px;
}

/* 按鈕基礎樣式 */
.action-buttons button {
  background-color: transparent;
  border: 1.5px solid #00ff00;
  color: #00ff00;
  padding: 6px 14px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  font-family: 'Courier New', Courier, monospace;
  transition: background-color 0.3s, color 0.3s;
  user-select: none;
  box-shadow: 0 0 6px #00ff00;
}

/* 按鈕 hover 狀態 */
.action-buttons button:hover {
  background-color: #00ff00;
  color: #000;
}

/* 請假按鈕特別色調 */
.action-buttons .btn-leave {
  border-color: #ff5555;
  color: #ff5555;
  box-shadow: 0 0 6px #ff5555;
}

/* 請假按鈕 hover */
.action-buttons .btn-leave:hover {
  background-color: #ff5555;
  color: #fff;
}

/* 使用者資訊區 */
.topbar .user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

/* 使用者名稱樣式 */
.topbar .username {
  font-weight: bold;
  text-shadow: 0 0 5px #00ff00;
}

/* 登出按鈕 */
.topbar button {
  background-color: transparent;
  border: 1px solid #00ff00;
  color: #00ff00;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Courier New', Courier, monospace;
  transition: background-color 0.3s, color 0.3s;
}

/* 登出按鈕 hover */
.topbar button:hover {
  background-color: #00ff00;
  color: #000;
}

/* 月曆區 */
.calendar {
  margin-top: 20px;
}

/* 月曆標題 */
.calendar h3 {
  text-align: center;
  margin-bottom: 12px;
  font-weight: bold;
  font-size: 22px;
  text-shadow: 0 0 6px #00ff00;
}

/* 月曆格子 */
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  user-select: none;
}

/* 星期名稱格子 */
.day-name {
  text-align: center;
  font-weight: bold;
  padding: 6px 0;
  border-bottom: 1px solid #00ff00;
}

/* 日期格子 */
.calendar-day {
  position: relative;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #00ff00;
  border-radius: 4px;
  cursor: default;
  user-select: none;
  transition: background-color 0.3s;
  padding: 6px;
  box-sizing: border-box;
  flex-direction: column;
}

/* 日期右上角的數字 */
.date-number {
  position: absolute;
  top: 4px;
  right: 6px;
  font-size: 12px;
  font-weight: bold;
  color: #00ff00;
  user-select: none;
  pointer-events: none;
}

/* 今天的日期格子樣式 */
.calendar-day.today {
  background-color: #00ff00;
  color: #000;
  font-weight: bold;
  box-shadow: 0 0 8px #00ff00;
}

/* 今天日期數字反色 */
.calendar-day.today .date-number {
  color: #00ff00;
  text-shadow:
    -1px -1px 0 #000,
     1px -1px 0 #000,
    -1px  1px 0 #000,
     1px  1px 0 #000;
  font-weight: bold;
}

/* 空白格子，無邊框 */
.calendar-day.blank {
  border: none;
  background-color: transparent;
  cursor: default;
}
</style>
