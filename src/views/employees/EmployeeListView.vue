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
            <el-table-column prop="employeeCode" label="員工編號" label-class-name="center-header" width="180" />
            <el-table-column prop="name" label="姓名" label-class-name="center-header" width="180" />
            <el-table-column prop="gender" label="性別" label-class-name="center-header" width="60" align="center">
                <template #default="{ row }">
                    <el-icon :style="{ color: row.gender === 0 ? '#409EFF' : '#F56C6C', fontSize: '20px' }">
                        <User />
                    </el-icon>
                </template>
            </el-table-column>
            <el-table-column prop="email" label="信箱" label-class-name="center-header" width="230" />
            <el-table-column prop="department" label="部門" label-class-name="center-header" align="center" width="180" />
            <el-table-column prop="position" label="職稱" label-class-name="center-header" align="center" width="150" />
            <el-table-column prop="shift" label="班別" label-class-name="center-header" align="center" width="150">
                <template #default="{ row }" label-class-name="center-header">
                    <el-tag :type="row.shift === 0 ? 'success' : 'danger'" effect="dark">
                        {{ row.shift === 0 ? '日班' : '晚班' }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="狀態" label-class-name="center-header" align="center" width="150">
                <template #default="{ row }" label-class-name="center-header">
                    <el-tag :type="row.status === 'Y' ? 'success' : 'danger'" effect="dark">
                        {{ row.status === 'Y' ? '在職' : '離職' }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="到職日" label-class-name="center-header" align="center" width="180">
                <template #default="{ row }">
                    {{ row.hireDate?.substring(0, 10) }}
                </template>
            </el-table-column>
            <!-- 操作欄 -->
            <el-table-column label="操作" width="200" label-class-name="center-header" align="center">
                <template #default="{ row }">
                    <el-button class="hacker-btn-small" size="medium" @click="openEditDialog(row)">修改資料</el-button>
                    <el-button class="hacker-btn-small red-hover" size="medium"
                        @click="openAccountDialog(row)">帳號設定</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 新增員工對話框 -->
        <el-dialog title="新增員工" v-model="showAddDialog" width="500px">
            <el-form :model="addForm" :rules="rules" ref="formRef" label-width="100px">
                <el-form-item style="margin-top: 15px;" label="帳號" prop="username">
                    <el-input v-model="addForm.username" />
                </el-form-item>
                <el-form-item label="密碼" prop="password">
                    <el-input v-model="addForm.password" />
                </el-form-item>
                <el-form-item label="員工編號" prop="employeeCode">
                    <el-input v-model="addForm.employeeCode" />
                </el-form-item>
                <el-form-item label="員工名稱" prop="name">
                    <el-input v-model="addForm.name" />
                </el-form-item>
                <el-form-item label="性別" prop="gender">
                    <el-select v-model="addForm.gender" placeholder="選擇性別">
                        <el-option label="男" value=0 />
                        <el-option label="女" value=1 />
                    </el-select>
                </el-form-item>
                <el-form-item label="部門名稱" prop="department">
                    <el-input v-model="addForm.department" />
                </el-form-item>
                <el-form-item label="職稱" prop="position">
                    <el-input v-model="addForm.position" />
                </el-form-item>
                <el-form-item label="班別" prop="shift">
                    <el-select v-model="addForm.shift" placeholder="選擇班別">
                        <el-option label="日班" value=0 />
                        <el-option label="晚班" value=1 />
                    </el-select>
                </el-form-item>
                <el-form-item label="到職日" prop="hireDate">
                    <el-date-picker v-model="addForm.hireDate" type="date" placeholder="選擇日期" format="YYYY-MM-DD"
                        value-format="YYYY-MM-DD" style="width: 100%;" />
                </el-form-item>
                <el-form-item label="角色" prop="roleId">
                    <el-select v-model="addForm.roleId" placeholder="選擇角色">
                        <el-option label="員工" value=3 />
                        <el-option label="人資" value=4 />
                        <el-option label="管理者" value=2 />
                        <el-option label="最高權限" value=1 />
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="showAddDialog = false">取消</el-button>
                <el-button class="hacker-btn-small red-hover" @click="submitAdd">新增</el-button>
            </template>
        </el-dialog>

        <!-- 修改帳號設定對話框 -->
        <el-dialog title="帳號密碼設定" v-model="showAccountDialog" width="500px">
            <el-form :model="accountForm" :rules="accountRules" ref="accountFormRef" label-width="100px">
                <el-form-item style="margin-top: 15px;" label="帳號" prop="username">
                    <el-input v-model="accountForm.username" disabled />
                </el-form-item>
                <el-form-item label="舊密碼" prop="oldPassword">
                    <el-input v-model="accountForm.oldPassword" show-password />
                </el-form-item>
                <el-form-item label="新密碼" prop="newPassword">
                    <el-input v-model="accountForm.newPassword" show-password />
                </el-form-item>
                <el-form-item label="確認密碼" prop="confirmPassword">
                    <el-input v-model="accountForm.confirmPassword" show-password />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="showAccountDialog = false">取消</el-button>
                <el-button class="hacker-btn-small red-hover" @click="submitAccount">儲存</el-button>
            </template>
        </el-dialog>

        <!-- 修改員工對話框 -->
        <el-dialog title="修改員工" v-model="showEditDialog" width="500px">
            <el-form :model="editForm" :rules="rules" ref="formRef" label-width="100px">
                <!-- 表單欄位同新增 -->
                <el-form-item style="margin-top: 15px;" label="員工編號" prop="employeeCode">
                    <el-input v-model="editForm.employeeCode" />
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="editForm.name" />
                </el-form-item>
                <el-form-item label="性別" prop="gender">
                    <el-select v-model="editForm.gender" placeholder="選擇性別">
                        <el-option :label="'男'" :value="0" />
                        <el-option :label="'女'" :value="1" />
                    </el-select>
                </el-form-item>
                <el-form-item label="部門" prop="department">
                    <el-input v-model="editForm.department" />
                </el-form-item>
                <el-form-item label="職稱" prop="position">
                    <el-input v-model="editForm.position" />
                </el-form-item>
                <el-form-item label="狀態" prop="status">
                    <el-select v-model="editForm.status" placeholder="選擇狀態">
                        <el-option label="在職" value="Y" />
                        <el-option label="離職" value="N" />
                    </el-select>
                </el-form-item>
                <el-form-item label="班別" prop="shift">
                    <el-select v-model="editForm.shift" placeholder="選擇班別">
                        <el-option :label="'日班'" :value="0" />
                        <el-option :label="'晚班'" :value="1" />
                    </el-select>
                </el-form-item>
                <el-form-item label="到職日" prop="hireDate">
                    <el-date-picker v-model="editForm.hireDate" type="date" placeholder="選擇日期" format="YYYY-MM-DD"
                        value-format="YYYY-MM-DD" style="width: 100%;" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="showEditDialog = false">取消</el-button>
                <el-button class="hacker-btn-small red-hover" @click="submitEdit">儲存</el-button>
            </template>
        </el-dialog>
        <!-- 分頁元件 -->
        <div style="margin-top: 20px; text-align: right;">
            <el-pagination background layout="prev, pager, next" :current-page="page" :page-size="pageSize"
                :total="totalCount" @current-change="handlePageChange" />
        </div>
    </Layout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import Layout from '../../components/Layout.vue'
import { apiGet, apiPost, apiPut } from '@/utils/api'
import {
    AddEmployeeModel,
    defaultAddEmployee,
    EditEmployeeModel,
    defaultEditEmployee,
    Employee,
    EmployeeListData,
} from '@/models/employee'
import { User } from '@element-plus/icons-vue'
import type { FormItemRule } from 'element-plus'

// 員工清單與狀態
const employees = ref<Employee[]>([])
const loading = ref(false)

const page = ref(1)
const pageSize = 10
const totalCount = ref(0)

async function fetchEmployees() {
    loading.value = true
    try {
        const res = await apiGet<EmployeeListData>('/api/User/userAndEmployeeData', {
            page: page.value,
            pageSize: pageSize,
        })
        employees.value = res.items
        totalCount.value = res.totalCount
    } catch (error) {
        ElMessage.error('取得員工資料失敗：' + ((error as any)?.message || error))
    } finally {
        loading.value = false
    }
}

function handlePageChange(newPage: number) {
    page.value = newPage
    fetchEmployees()
}

onMounted(() => {
    fetchEmployees()
})

// 控制對話框顯示
const showAddDialog = ref(false)
const showEditDialog = ref(false)

// 表單資料
const addForm = reactive<AddEmployeeModel>({ ...defaultAddEmployee })
const editForm = reactive<EditEmployeeModel>({ ...defaultEditEmployee })
const formRef = ref()

// 表單驗證規則
const rules = {
    username: [{ required: true, message: '請輸入帳號', trigger: 'blur' }],
    password: [{ required: true, message: '請輸入密碼', trigger: 'blur' }],
    name: [{ required: true, message: '請輸入員工名稱', trigger: 'blur' }],
    hireDate: [{ required: true, message: '請選擇到職日', trigger: 'change' }],
    roleId: [{ required: true, message: '請選擇角色', trigger: 'change' }],
}

// 新增提交
async function submitAdd() {
    formRef.value.validate(async (valid: boolean) => {
        if (!valid) return
        try {
            await apiPost('/api/Auth/register', {
                ...addForm,
                hireDate: addForm.hireDate + 'T00:00:00'
            })
            ElMessage.success('新增成功')
            showAddDialog.value = false
            Object.assign(addForm, { ...defaultAddEmployee })
            fetchEmployees()
        } catch (err: any) {
            const message =
                err.response?.data?.message || // 透過 axios 取得後端錯誤訊息
                err.message ||
                '新增失敗'
            ElMessage.error(message)
        }
    })
}

// 更新提交
async function submitEdit() {
    formRef.value.validate(async (valid: boolean) => {
        if (!valid) return
        try {
            await apiPut('/api/User/updateEmployee', {
                ...editForm,
                hireDate: editForm.hireDate
            })
            ElMessage.success('更新成功')
            showEditDialog.value = false
            Object.assign(editForm, { ...defaultEditEmployee })
            fetchEmployees()
        } catch (err: any) {
            const message =
                err.response?.data?.message || // 透過 axios 取得後端錯誤訊息
                err.message ||
                '更新失敗'
            ElMessage.error(message)
        }
    })
}

// 開啟修改對話框，並將員工資料帶入表單中
function openEditDialog(row: Employee) {
    Object.assign(editForm, {
        employeeId: row.employeeId,
        employeeCode: row.employeeCode,
        name: row.name,
        gender: row.gender,
        department: row.department,
        position: row.position,
        status: row.status,
        shift: row.shift,
        hireDate: row.hireDate,
    })
    showEditDialog.value = true
}

// 帳密設定
const showAccountDialog = ref(false)
const accountForm = reactive({
    userId: 0,
    username: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
})

const accountFormRef = ref()
const accountRules = {
    oldPassword: [{ required: true, message: '請輸入舊密碼', trigger: 'blur' }],
    newPassword: [
        { required: true, message: '請輸入新密碼', trigger: 'blur' },
        { min: 6, message: '密碼長度至少6碼', trigger: 'blur' },
    ],
    confirmPassword: [
    { required: true, message: '請再次輸入新密碼', trigger: 'blur' },
    {
      validator: (_rule: FormItemRule, value: string) => {
        if (value !== accountForm.newPassword) {
          return Promise.reject('輸入的新密碼不一致')
        }
        return Promise.resolve()
      },
      trigger: 'blur',
    },
  ],
}

function openAccountDialog(row: Employee) {
    accountForm.userId = row.userId
    accountForm.username = row.username || ''
    accountForm.oldPassword = ''
    accountForm.newPassword = ''
    showAccountDialog.value = true
}

async function submitAccount() {
    accountFormRef.value.validate(async (valid: boolean) => {
        if (!valid) return
        try {
            await apiPut('/api/User/updateUser', {
                userId: accountForm.userId,
                username: accountForm.username,
                oldPassword: accountForm.oldPassword,
                newPassword: accountForm.newPassword,
            })
            ElMessage.success('密碼已更新')
            showAccountDialog.value = false
        } catch (err: any) {
            const message =
                err.response?.data?.message || // axios 錯誤回應格式
                err.message ||
                '更新失敗'
            ElMessage.error(message)
        }
    })
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/employee-style.scss';
</style>
