export interface AttendanceData {
    id?: string,
    employeeID: string,
    attendancePeriod: string,
    year: number,
    state: string,
    comments: CommentData[],
    attendance: any,
    overtime: any,
    modificationRequested: boolean,
    modifications: any[],
    stage: string,
    associatedShiftType: string,
}

export interface CommentData {
    commentBy: string,
    timestamp: string,
    comment: string,
}

//? the attendance data is grouped by month
//? if an employee wants to declare an overtime the data will look like the above.
//? if an employee does not want to declare an overtime, pass an empty array.
//? year is the year of the the attendance
