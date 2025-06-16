// models/employee.ts

// 新增員工欄位
export interface AddEmployeeModel {
  username: string
  password: string
  employeeCode: string
  name: string
  department: string
  position: string
  hireDate: string
  roleId: number
}

// 修改員工欄位
export interface EditEmployeeModel {
  employeeCode: string
  name: string
  department: string
  position: string
  status: 'Y' | 'N'
  hireDate: string
}

// 預設新增員工資料
export const defaultAddEmployee: AddEmployeeModel = {
  username: '',
  password: '',
  employeeCode: '',
  name: '',
  department: '',
  position: '',
  hireDate: '',
  roleId: 3,
}

// 預設修改員工資料
export const defaultEditEmployee: EditEmployeeModel = {
  employeeCode: '',
  name: '',
  department: '',
  position: '',
  status: 'Y',
  hireDate: '',
}

// 員工資料
export interface Employee {
  userId: number
  username: string
  email: string | null
  employeeId: number
  employeeCode: string
  name: string
  department: string
  position: string
  status: string
  hireDate: string
}

// 分頁資料
export interface EmployeeListData {
  items: Employee[]
  totalCount: number
  page: number
  pageSize: number
}

// API 統一回傳格式
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}
