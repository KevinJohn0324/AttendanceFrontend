// models/employee.ts

// 新增員工欄位
export interface AddEmployeeModel {
  username: string
  password: string
  employeeCode: string
  name: string
  gender: number | null
  department: string
  position: string
  shift: number | null
  hireDate: string
  roleId: number | null
}

// 修改員工欄位
export interface EditEmployeeModel {
  employeeId: number | null
  employeeCode: string
  name: string
  gender: number | null
  department: string
  position: string
  shift: number | null
  status: 'Y' | 'N'
  hireDate: string
}

// 預設新增員工資料
export const defaultAddEmployee: AddEmployeeModel = {
  username: '',
  password: '',
  employeeCode: '',
  name: '',
  gender: null,
  department: '',
  position: '',
  shift: null,
  hireDate: '',
  roleId: null,
}

// 預設修改員工資料
export const defaultEditEmployee: EditEmployeeModel = {
  employeeId: null,
  employeeCode: '',
  name: '',
  gender: null,
  department: '',
  position: '',
  shift: null,
  status: 'Y',
  hireDate: '',
}

// 使用者帳密及員工資料
export interface Employee {
  userId: number
  username: string
  email: string | null
  employeeId: number
  employeeCode: string
  name: string
  gender: number | null
  department: string
  position: string
  shift: number | null
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
