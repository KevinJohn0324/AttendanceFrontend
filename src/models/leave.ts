// models/leave.ts

// 假單資料
export interface LeaveRecord {
  id: number
  leaveType: string
  startTime: string
  endTime: string
  reason: string
  statusDisplay: string
  createdAt: string
  updatedAt: string
}

// 假單分頁資料
export interface LeaveRecordData {
  items: LeaveRecord[]
  totalCount: number
  page: number
  pageSize: number
}

export interface LeaveTimelineItem {
  status: string
  period: string
}

// 假單審核資料
export interface LeaveApprovalRecord {
  id: number
  leaveType: string
  startTime: string
  endTime: string
  reason: string
  status: string
  statusDisplay: string
  createdAt: string
  updatedAt: string
  employeeName: string
  currentApprovalRoleId: number | null
  finalApprovedAt: string | null
  timeline: LeaveTimelineItem[]
}

// 假單審核分頁資料
export interface LeaveApprovalData {
  items: LeaveApprovalRecord[]
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
