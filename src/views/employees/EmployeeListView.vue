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
            <el-table-column label="到職日">
                <template #default="{ row }">
                    {{ row.hireDate?.substring(0, 10) }}
                </template>
            </el-table-column>
            <!-- 操作欄 -->
            <el-table-column label="操作" width="120">
                <template #default="{ row }">
                    <el-button class="hacker-btn-small" size="medium" @click="openEditDialog(row)">修改</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 新增員工對話框 -->
        <el-dialog title="新增員工" v-model="showAddDialog" width="500px">
            <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
                <el-form-item style="margin-top: 15px;" label="員工編號" prop="employeeCode">
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
                    <el-date-picker v-model="form.hireDate" type="date" placeholder="選擇日期" format="YYYY-MM-DD"
                        value-format="YYYY-MM-DD" style="width: 100%;" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="showAddDialog = false">取消</el-button>
                <el-button type="primary" @click="submitAdd">新增</el-button>
            </template>
        </el-dialog>

        <!-- 修改員工對話框 -->
        <el-dialog title="修改員工" v-model="showEditDialog" width="500px">
            <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
                <!-- 表單欄位同新增 -->
                <el-form-item style="margin-top: 15px;" label="員工編號" prop="employeeCode">
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
                    <el-date-picker v-model="form.hireDate" type="date" placeholder="選擇日期" format="YYYY-MM-DD"
                        value-format="YYYY-MM-DD" style="width: 100%;" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="showEditDialog = false">取消</el-button>
                <el-button type="primary" @click="submitEdit">儲存</el-button>
            </template>
        </el-dialog>
        <!-- 分頁元件 -->
        <div style="margin-top: 20px; text-align: right;">
            <el-pagination background layout="prev, pager, next" :current-page="page" :page-size="pageSize"
                :total="totalCount" @current-change="handlePageChange" />
        </div>
    </Layout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import Layout from '../../components/Layout.vue'
import { apiGet } from '@/utils/api'

// 員工清單與狀態
const employees = ref([])
const loading = ref(false)

const page = ref(1)
const pageSize = 10
const totalCount = ref(0)

async function fetchEmployees() {
    loading.value = true
    try {
        const res = await apiGet('/api/User/userAndEmployeeData', {
            page: page.value,
            pageSize: pageSize,
        })
        employees.value = res.items
        totalCount.value = res.totalCount
    } catch (error) {
        alert('取得員工資料失敗：' + (error.message || error))
    } finally {
        loading.value = false
    }
}

function handlePageChange(newPage) {
    page.value = newPage
    fetchEmployees()
}

onMounted(() => {
    fetchEmployees()
})

// 表單與對話框狀態
const showAddDialog = ref(false)
const showEditDialog = ref(false)

const form = reactive({
    employeeCode: '',
    name: '',
    department: '',
    position: '',
    status: 'Y',
    hireDate: '',
})

const rules = {
    employeeCode: [{ required: true, message: '請輸入員工編號', trigger: 'blur' }],
    name: [{ required: true, message: '請輸入姓名', trigger: 'blur' }],
    department: [{ required: true, message: '請輸入部門', trigger: 'blur' }],
    position: [{ required: true, message: '請輸入職稱', trigger: 'blur' }],
    status: [{ required: true, message: '請選擇狀態', trigger: 'change' }],
    hireDate: [{ required: true, message: '請選擇到職日', trigger: 'change' }],
}

const formRef = ref()

function submitAdd() {
    formRef.value.validate((valid) => {
        if (valid) {
            console.log('送出新增', form)
            showAddDialog.value = false
            Object.assign(form, {
                employeeCode: '',
                name: '',
                department: '',
                position: '',
                status: 'Y',
                hireDate: '',
            })
        }
    })
}

function openEditDialog(row) {
    Object.assign(form, {
        employeeCode: row.employeeCode,
        name: row.name,
        department: row.department,
        position: row.position,
        status: row.status,
        hireDate: row.hireDate,
    })
    showEditDialog.value = true
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/employee-style.scss';
</style>
