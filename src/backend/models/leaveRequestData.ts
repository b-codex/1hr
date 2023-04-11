export interface LeaveRequestData {
    leaveRequest: string;
    leaveState: string;
    leaveStage: string;
    leaveType: string;
    authorizedDays: string;
    firstDayOfLeave: string;
    lastDayOfLeave: string;
    dayOfReturn: string;
    numberOfLeaveDaysRequested: number;
    balanceLeaveDays: number;
    comments: CommentData[];
};

interface CommentData {
    comment: string;
    date: string;
    by: string;
}