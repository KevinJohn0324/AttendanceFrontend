// models/leave.ts

// 請假單資料
export interface LeaveRecord {
  id: number
  leaveType: string
  startTime: string
  endTime: string
  reason: string
  statusDisplay: string
  createdAt: string
}

// 請假單分頁資料
export interface LeaveRecordData {
  items: LeaveRecord[]
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
