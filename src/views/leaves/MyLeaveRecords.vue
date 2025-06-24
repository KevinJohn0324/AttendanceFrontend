<template>
  <Layout>
    <div class="leave-page">
      <h2>個人假單紀錄</h2>
      <!-- 資料表 -->
      <el-table :data="Leaves" border style="width: 100%" header-cell-class-name="center-header"
        :empty-text="loading ? '載入中...' : 'No Data'">
        <el-table-column prop="leaveType" label="假別">
          <template #default="{ row }">
            {{ insertSpaces(row.leaveType) }}
          </template>
        </el-table-column>
        <el-table-column prop="startTime" label="開始時間">
          <template #default="{ row }">
            {{ formatDate(row.startTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="endTime" label="結束時間">
          <template #default="{ row }">
            {{ formatDate(row.endTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="reason" label="原因" />
        <el-table-column prop="statusDisplay" label="狀態">
          <template #default="{ row }">
            <span :class="getStatusClass(row.statusDisplay)">
              {{ row.statusDisplay }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="申請時間">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column prop="updatedAt" label="更新時間">
          <template #default="{ row }">
            {{ formatDate(row.updatedAt) }}
          </template>
        </el-table-column>
      </el-table>

      <!-- 分頁元件 -->
      <div style="margin-top: 20px; text-align: right; ">
        <el-pagination background layout="prev, pager, next" :current-page="page" :page-size="pageSize"
          :total="totalCount" @current-change="handlePageChange" />
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import Layout from '../../components/Layout.vue'
import { apiGet, apiPost, apiPut } from '@/utils/api'
import { LeaveRecord, LeaveRecordData, ApiResponse } from '@/models/leave'

// 假單記錄資料
const Leaves = ref<LeaveRecord[]>([]);
const loading = ref(false);

const page = ref(1);
const pageSize = 10;
const totalCount = ref(0)

async function fetchLeaves() {
  loading.value = true;
  try {
    const res = await apiGet<LeaveRecordData>("/api/Leave/myLeave", {
      page: page.value,
      pageSize: pageSize,
    })
    Leaves.value = res.items;
    totalCount.value = res.totalCount
  } catch (error) {
    ElMessage.error('取得假單資料失敗：' + ((error as any)?.message || error))
  } finally {
    loading.value = false;
  }
}

// 頁面切換
function handlePageChange(newPage: number) {
  page.value = newPage;
  fetchLeaves();
}

// 頁面載入
onMounted(() => {
  fetchLeaves();
});

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
}

function getStatusClass(status: string) {
  switch (status) {
    case '審核中':
      return 'status-pending';
    case '通過':
      return 'status-approved';
    case '退回':
      return 'status-rejected';
    case '取消':
      return 'status-canceled';
    default:
      return '';
  }
}

function insertSpaces(str: string, count = 2) {
  return str.split('').join(' '.repeat(count))
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/leave-style.scss';
</style>
