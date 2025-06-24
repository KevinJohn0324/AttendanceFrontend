// models/index.ts

export interface AttLog {
  workDate: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: string;
}

// 假單表單
export interface LeaveForm {
  leaveCode: string;
  startTime: string;
  endTime: string;
  reason: string;
}

// 預設假單表單
export const defaultLeaveForm: LeaveForm = {
  leaveCode: '', 
  startTime: '',
  endTime: '',
  reason: '',
}