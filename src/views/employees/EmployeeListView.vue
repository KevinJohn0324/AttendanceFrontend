<template>
    <Layout>
        <h3 style="text-align:center; margin-bottom: 15px;">員工資料清單</h3>

        <!-- 新增按鈕 -->
        <div style="text-align: right; margin-bottom: 10px;">
            <el-button class="hacker-btn" size="large" @click="showAddDialog = true">新增員工</el-button>
        </div>

        <div v-if="loading" style="text-align:center; color:#00ff00; margin: 20px 0;">載入中...</div>
        <el-table v-else :data="employees" style="width: 100%;" border
            :header-cell-style="{ background: '#000', color: '#00ff00' }"
            :cell-style="{ background: '#121212', color: '#00ff00' }">
            <el-table-column prop="employeeCode" label="員工編號" />
            <el-table-column prop="name" label="姓名" />
            <el-table-column prop="department" label="部門" />
            <el-table-column prop="position" label="職稱" />
            <el-table-column label="狀態">
                <template #default="{ row }">
                    <el-tag :type="row.status === 'Y' ? 'success' : 'danger'" effect="dark">
                        {{ row.status === 'Y' ? '在職' : '離職' }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="hireDate" label="到職日" />
            <!-- 操作欄 -->
            <el-table-column label="操作" width="120">
                <template #default="{ row }">
                    <el-button class="hacker-btn-small" size="medium" @click="openEditDialog(row)">修改</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 新增員工對話框 -->
        <el-dialog title="新增員工" :visible.sync="showAddDialog" width="500px">
            <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
                <el-form-item label="員工編號" prop="employeeCode">
                    <el-input v-model="form.employeeCode" />
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="form.name" />
                </el-form-item>
                <el-form-item label="部門" prop="department">
                    <el-input v-model="form.department" />
                </el-form-item>
                <el-form-item label="職稱" prop="position">
                    <el-input v-model="form.position" />
                </el-form-item>
                <el-form-item label="狀態" prop="status">
                    <el-select v-model="form.status" placeholder="選擇狀態">
                        <el-option label="在職" value="Y" />
                        <el-option label="離職" value="N" />
                    </el-select>
                </el-form-item>
                <el-form-item label="到職日" prop="hireDate">
                    <el-date-picker v-model="form.hireDate" type="date" placeholder="選擇日期" format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="showAddDialog = false">取消</el-button>
                <el-button type="primary" @click="submitAdd">新增</el-button>
            </template>
        </el-dialog>

        <!-- 修改員工對話框 -->
        <el-dialog title="修改員工" :visible.sync="showEditDialog" width="500px">
            <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
                <!-- 表單欄位同新增 -->
                <el-form-item label="員工編號" prop="employeeCode">
                    <el-input v-model="form.employeeCode" disabled />
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="form.name" />
                </el-form-item>
                <el-form-item label="部門" prop="department">
                    <el-input v-model="form.department" />
                </el-form-item>
                <el-form-item label="職稱" prop="position">
                    <el-input v-model="form.position" />
                </el-form-item>
                <el-form-item label="狀態" prop="status">
                    <el-select v-model="form.status" placeholder="選擇狀態">
                        <el-option label="在職" value="Y" />
                        <el-option label="離職" value="N" />
                    </el-select>
                </el-form-item>
                <el-form-item label="到職日" prop="hireDate">
                    <el-date-picker v-model="form.hireDate" type="date" placeholder="選擇日期" format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="showEditDialog = false">取消</el-button>
                <el-button type="primary" @click="submitEdit">儲存</el-button>
            </template>
        </el-dialog>
    </Layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Layout from '../../components/Layout.vue'
import { apiGet } from '@/utils/api'

const employees = ref([])
const loading = ref(false)

onMounted(async () => {
    loading.value = true
    try {
        const data = await apiGet('/api/User/userAndEmployeeData')
        employees.value = data.items
    } catch (error) {
        alert('取得員工資料失敗：' + (error.message || error))
    } finally {
        loading.value = false
    }
})
</script>

<style lang="scss" scoped>
.hacker-btn {
    padding: 8px 18px;
    background-color: transparent;
    border: 2px solid #00ff00;
    border-radius: 4px;
    color: #00ff00;
    font-family: 'Courier New', Courier, monospace;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s, color 0.3s, box-shadow 0.3s;
    box-shadow: 0 0 5px #00ff00;
    user-select: none;

    &:hover {
        background-color: #00ff00;
        color: #000;
        box-shadow: 0 0 15px #00ff00;
    }

    &:active {
        box-shadow: 0 0 8px #33ff33;
        background-color: #33ff33;
        color: #000;
    }
}

.hacker-btn-small {
  padding: 4px 10px;
  background-color: transparent;
  border: 1.5px solid #00ff00;
  border-radius: 3px;
  color: #00ff00;
  font-family: 'Courier New', Courier, monospace;
  font-weight: bold;
  cursor: pointer;
  font-size: 13px;
  transition: background-color 0.3s, color 0.3s, box-shadow 0.3s;
  box-shadow: 0 0 4px #00ff00;
  user-select: none;

  &:hover {
    background-color: #00ccff;
    border-color: #00ccff;
    color: #000;
    box-shadow: 0 0 10px #00ccff;
  }

  &:active {
    box-shadow: 0 0 6px #33ffff;
    background-color: #33ffff;
    color: #000;
    border-color: #33ffff;
  }
}

</style>
