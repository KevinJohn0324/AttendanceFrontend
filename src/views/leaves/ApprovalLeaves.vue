<template>
  <Layout>
    <h3 style="text-align:center; margin-bottom: 15px">假單審核清單</h3>
    <div v-if="loading" style="text-align:center; color:#00ff00; margin:20px 0">載入中...</div>
    <el-table v-else :data="leaves" style="width:100%;" border
      :header-cell-style="{ background: '#000', color: '#00ff00' }"
      :cell-style="{ background: '#121212', color: '#00ff00' }" :expand-on-click-row="true">
      <!-- TODO時間線擴展行 -->
      <el-table-column type="expand">
        <template #default="{ row }">
          <div class="horizontal-timeline">
            <template v-for="(item, index) in row.timeline" :key="index">
              <div class="event" :class="getTimelineItemClass(item)">
                <span class="dot"></span>
                <span class="label">
                  {{ item.status }}
                  <span v-if="shouldShowTime(item)">({{ item.period }})</span>
                </span>
              </div>
              <div v-if="index < row.timeline.length - 1" class="line"></div>
            </template>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="employeeName" label="員工姓名" align="center" />
      <el-table-column prop="leaveType" label="請假種類" align="center" />
      <el-table-column label="請假時間" align="center">
        <template #default="{ row }">
          {{ row.startTime?.substring(0, 16).replace('T', ' ') }} ~ {{ row.endTime?.substring(0, 16).replace('T', ' ') }}
        </template>
      </el-table-column>
      <el-table-column prop="statusDisplay" label="狀態" align="center" />
      <el-table-column label="操作" align="center">
        <template #default="{ row }">
          <el-button class="hacker-btn-small" size="medium">同意</el-button>
          <el-button class="hacker-btn-small red-hover" size="medium">退回</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="margin-top:20px; text-align:right">
      <el-pagination background layout="prev, pager, next" :current-page="page" :page-size="pageSize"
        :total="totalCount" @current-change="handlePageChange" />
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import Layout from '../../components/Layout.vue'
import { apiGet } from '@/utils/api'
import { LeaveApprovalRecord, LeaveApprovalData, ApiResponse } from '@/models/leave'

const leaves = ref<LeaveApprovalRecord[]>([]);
const loading = ref(false)

const page = ref(1)
const pageSize = 10
const totalCount = ref(0)

async function fetchLeaves() {
  loading.value = true
  try {
    const res = await apiGet<LeaveApprovalData>('/api/Leave/pending', {
      page: page.value,
      pageSize: pageSize,
    })
    leaves.value = res.items
    totalCount.value = res.totalCount
  } catch (error) {
    ElMessage.error('取得假單資料失敗：' + ((error as any)?.message || error))
  } finally {
    loading.value = false;
  }
}

// 頁面切換
function handlePageChange(newPage: number) {
  page.value = newPage
  fetchLeaves()
}

// 頁面載入
onMounted(() => {
  fetchLeaves()
})


function getTimelineItemClass(item: { status: string }) {
  if (item.status.includes('審查中')) {
    return 'active';
  } else if (
    item.status.includes('完成') ||
    item.status.includes('同意') ||
    item.status.includes('通過')
  ) {
    return 'completed';
  } else if (
    item.status.includes('駁回') ||
    item.status.includes('取消')
  ) {
    return 'rejected';
  }
  return 'pending';
}


function shouldShowTime(item: { status: string }) {
  return !item.status.includes('審查中');
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/approvelLeave-style.scss';
</style>
