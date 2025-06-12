<template>
  <el-container style="height: 100vh;">
    <!-- 側邊欄 -->
    <el-aside width="220px" style="background-color: #000; color: #00ff00;">
      <h2 style="text-align:center; margin-bottom: 20px; color:#00ff00;">考勤系統</h2>
      <el-menu
        :default-active="activeMenu"
        background-color="#000"
        text-color="#00ff00"
        active-text-color="#00ff00"
        router
        @select="goTo"
        style="border-right: none;"
      >
        <el-menu-item index="home">首頁</el-menu-item>
        <el-menu-item index="employees">員工資料</el-menu-item>
        <el-menu-item index="records">打卡紀錄</el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 主內容 -->
    <el-container>
      <el-header
        style="display:flex; justify-content:space-between; align-items:center; background-color:#121212; color:#00ff00; border-bottom: 1px solid #00ff00;"
      >
        <div style="display:flex; gap: 20px; align-items:center;">
          <div style="font-weight:bold;">{{ currentTime }}</div>
          <el-button size="medium" type="success" @click="punch">打卡</el-button>
          <el-button size="medium" type="danger" @click="leave">請假</el-button>
        </div>
        <div style="display:flex; align-items:center; gap: 15px;">
          <span style="font-weight:bold;">{{ username }}</span>
          <el-button size="medium" type="warning" @click="logout">登出</el-button>
        </div>
      </el-header>

      <el-main style="background-color: #121212; color:#00ff00; padding: 20px;">
  <h3 style="text-align:center; margin-bottom: 30px;">{{ year }} 年 {{ month }} 月</h3>
  <div class="calendar-grid">
    <div v-for="day in dayNames" :key="day" class="day-name">
      {{ day }}
    </div>

    <div v-for="blank in blanks" :key="'b' + blank" class="blank"></div>

    <div
      v-for="day in daysInMonthArr"
      :key="day"
      :class="['date-cell', { today: isToday(day) }]"
    >
      <div class="date-number">{{ day }}</div>
    </div>
  </div>
</el-main>

    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = computed(() => authStore.username || '使用者')

const activeMenu = ref('home')
function goTo(page) {
  activeMenu.value = page
  router.push(`/${page === 'home' ? '' : page}`)
}

function logout() {
  authStore.logout()
  router.push('/login')
}

function punch() {
  alert('打卡成功！')
}

function leave() {
  alert('請假申請送出！')
}

const now = new Date()
const year = now.getFullYear()
const month = now.getMonth() + 1
const dayNames = ['日', '一', '二', '三', '四', '五', '六']

function daysInMonth(y, m) {
  return new Date(y, m, 0).getDate()
}
const daysInMonthValue = daysInMonth(year, month)

const firstDay = new Date(year, month - 1, 1).getDay()
const blanks = Array.from({ length: firstDay }, (_, i) => i + 1)
const daysInMonthArr = Array.from({ length: daysInMonthValue }, (_, i) => i + 1)

function isToday(day) {
  const today = new Date()
  return (
    day === today.getDate() &&
    month === today.getMonth() + 1 &&
    year === today.getFullYear()
  )
}

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

<style lang="scss" scoped>
$main-color: #00ff00;
$main-bg-color: transparent;
$today-bg-color: #00ff00;
$today-text-color: #000;
$black-shadow: #000;

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;

  .day-name {
    text-align: center;
    font-weight: bold;
    height: 30px;
    line-height: 30px;
  }

  .blank {
    background: $main-bg-color;
    border: none;
    height: 80px;
  }

  .date-cell {
    border: 1px solid $main-color;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;
    cursor: default;
    position: relative;

    .date-number {
      position: absolute;
      top: 4px;
      right: 6px;
      font-weight: bold;
      color: $main-color;
      font-size: 12px;
    }

    &.today {
      background-color: $today-bg-color !important;
      color: $today-text-color !important;
      font-weight: bold;
      box-shadow: 0 0 8px $main-color;

      .date-number {
        /* 加黑色描邊 */
        text-shadow:
          -1px -1px 0 $black-shadow,
          1px -1px 0 $black-shadow,
          -1px 1px 0 $black-shadow,
          1px 1px 0 $black-shadow;
      }
    }
  }
}
</style>
