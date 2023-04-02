import { AttendanceData } from './../models/attendanceData';

export function calculateWorkedDays(attendanceData: AttendanceData) {
    let workedDays: number = 0;

    const attendance: any = attendanceData.attendance;
    const months: string[] = Object.keys(attendance);

    months.forEach(month => {

        const days: string[] = Object.keys(attendance[month]);

        days.forEach(day => {
            if (attendance[month][day] === "P" || attendance[month][day] === "H") workedDays++;
        });
    });

    return workedDays;
}

//? Use case
/* 
*   the input is attendance data for an employee
*   from the attendanceData, the function extracts the attendance values and calculates the number of days the user was present 
*/
