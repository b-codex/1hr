import { AttendanceData } from "../models/attendanceData";

export function calculateAbsentDays(attendanceData: AttendanceData) {
    let absentDays: number = 0;

    const attendance: any = attendanceData.attendance;
    const months: string[] = Object.keys(attendance);

    months.forEach(month => {

        const days: string[] = Object.keys(attendance[month]);

        days.forEach(day => {
            if (attendance[month][day] === "A") absentDays++;
        });
    });

    return absentDays;
}

//? Use case
/* 
*   the input is attendance data for an employee
*   from the attendanceData, the function extracts the attendance values and calculates the number of days the user was present 
*/
