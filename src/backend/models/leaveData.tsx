export interface LeaveData {
    id?: string;
    leaveRequestID: string;
    leaveState: string;
    leaveStage: string;
    leaveType: string;
    authorizedDays: string;
    firstDayOfLeave: string;
    lastDayOfLeave: string;
    dateOfReturn: string;
    numberOfLeaveDaysRequested: number;
    employeeID: string;
}
