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
          <el-menu-item index="leave/my">個人假單紀錄</el-menu-item>
          <el-menu-item index="leave/review">假單審核</el-menu-item>
          <el-menu-item index="leave/types">假單種類管理</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>

    <!-- 主內容區 -->
    <el-container>
      <el-header
        style="display:flex; justify-content:space-between; align-items:center; background-color:#121212; color:#00ff00; border-bottom: 1px solid #00ff00;">
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
        <!-- 月份選擇器 -->
        <div style="text-align:left; margin-bottom: 15px;">
          <el-date-picker v-model="selectedMonth" type="month" placeholder="選擇月份" format="yyyy-MM"
            :picker-options="pickerOptions" />
        </div>

        <!-- 顯示當前選擇年月 -->
        <h3 style="text-align:center; margin-bottom: 30px;">{{ selectedYear }} 年 {{ selectedMonthNum }} 月</h3>

        <!-- 日曆格子 -->
        <div class="calendar-grid">
          <!-- 星期欄位 -->
          <div v-for="day in dayNames" :key="day" :class="['day-name', { weekend: isWeekendHeader(day) }]">{{ day }}
          </div>
          <!-- 月初空白格 -->
          <div v-for="blank in blanks" :key="'b' + blank" class="blank"></div>
          <!-- 每日格子 -->
          <div v-for="item in daysWithLog" :key="item.day"
            :class="['date-cell', { today: isToday(item.day), weekend: isWeekend(item.day) }]">
            <div class="date-number">{{ item.day }}</div>
            <!-- 顯示的打卡紀錄內容 -->
            <template v-if="item.log">
              <div class="log-info">
                <div>上班: {{ formatTime(item.log.checkInTime) }}</div>
                <div>下班: {{ formatTime(item.log.checkOutTime) }}</div>
              </div>
            </template>
          </div>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { apiGet, apiPost } from '@/utils/api'
import type { AttLog } from '@/models/index'

// Router 與使用者狀態
const router = useRouter()
const authStore = useAuthStore()
const username = computed(() => authStore.user?.username || '使用者')

// 選單控制
const activeMenu = ref('home')

function goTo(page: string) {
  activeMenu.value = page
  if (page === 'home') router.push('/dashboard')
  else router.push(`/${page}`)
}

function logout() {
  authStore.logout()
  router.push('/login')
}

function leave() {
  alert('請假申請送出！')
}

// 現在時間
const currentTime = ref('')

function updateTime() {
  const d = new Date()
  currentTime.value = d.toLocaleTimeString('zh-TW', { hour12: false })
}

const selectedMonth = ref(new Date())
const selectedYear = computed(() => selectedMonth.value.getFullYear())
const selectedMonthNum = computed(() => selectedMonth.value.getMonth() + 1)

watch(selectedMonth, (newValue) => {
  console.log('selectedMonth updated to:', newValue);
  fetchData();
}, { immediate: true });

// 日曆計算
const dayNames = ['日', '一', '二', '三', '四', '五', '六']

function isWeekendHeader(day: string): boolean {
  return day === '日' || day === '六';
}

function daysInMonth(y: number, m: number) {
  return new Date(y, m, 0).getDate()
}

const daysInMonthArr = computed(() =>
  Array.from({ length: daysInMonth(selectedYear.value, selectedMonthNum.value) }, (_, i) => i + 1)
)

const firstDay = computed(() => new Date(selectedYear.value, selectedMonthNum.value - 1, 1).getDay())

const blanks = computed(() => Array.from({ length: firstDay.value }, (_, i) => i + 1))

const attLogs = ref<AttLog[]>([])

// 格式化時間
function formatTime(dtStr?: string) {
  if (!dtStr) return '--:--:--'
  const d = new Date(dtStr)
  if (isNaN(d.getTime())) return '--:--:--'
  return d.toLocaleTimeString('zh-TW', { hour12: false })
}

// 判斷是否為今天
function isToday(day: number) {
  const today = new Date()
  return (
    day === today.getDate() &&
    selectedMonthNum.value === today.getMonth() + 1 &&
    selectedYear.value === today.getFullYear()
  )
}

// 判斷周末
function isWeekend(day: number): boolean {
  // 取得選定月份的年份和月份
  const year = selectedMonth.value.getFullYear();
  const month = selectedMonth.value.getMonth();
  const date = new Date(year, month, day);
  const dayOfWeek = date.getDay();
  return dayOfWeek === 0 || dayOfWeek === 6;
}

// 取得指定日期的打卡資料
function getLogForDate(day: number): AttLog | undefined {
  return attLogs.value.find(log => {
    const logDate = new Date(log.workDate);
    return (
      logDate.getDate() === day &&
      logDate.getMonth() + 1 === selectedMonthNum.value &&
      logDate.getFullYear() === selectedYear.value
    );
  });
}

// 每天對應的資料
const daysWithLog = computed(() => {
  return daysInMonthArr.value.map(day => ({
    day,
    log: getLogForDate(day),
  }))
})

// 日期選擇器的限制
const pickerOptions = {
  disabledDate: (date: Date) => date > new Date(),
}

// 打卡資料取得API
async function fetchData() {
  try {
    console.log('Fetching data with:', { selectedMonth: selectedMonth.value, year: selectedYear.value, month: selectedMonthNum.value });
    const res = await apiGet<AttLog[]>(`/api/Attendance/attLog`, {
      year: selectedYear.value,
      month: selectedMonthNum.value,
    });
    attLogs.value = res || [];
  } catch (err: any) {
    const message =
      err.response?.data?.message || // 透過 axios 取得後端錯誤訊息
      err.message ||
      '取得打卡資料失敗'
    ElMessage.error(message)
  }
}

// 打卡API
async function punch() {
  try {
    const res = await apiPost<{ message: string }>('/api/Attendance/punch', {
      ip: '192.0.0.1',
      source: 'Web',
    })
    ElMessage.success(res.message || '打卡成功')
    await fetchData()
  } catch (err: any) {
    const message =
      err.response?.data?.message || // 透過 axios 取得後端錯誤訊息
      err.message ||
      '打卡失敗'
    ElMessage.error(message)
  }
}

// 更新時間
let timer: number | undefined = undefined
onMounted(() => {
  updateTime()
  timer = window.setInterval(updateTime, 1000)
})
onBeforeUnmount(() => {
  if (timer !== undefined) {
    clearInterval(timer)
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/index-style.scss';
</style>
