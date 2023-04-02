import moment from 'moment';
import { days } from '../constants/days';
import { AttendanceData } from './../models/attendanceData';

function isWeekday(year: number, month: number, day: number) {
    var day = new Date(year, month, day).getDay();
    return day != 0 && day != 6;
}

export function daysInMonth(iMonth: number, iYear: number) {
    return 32 - new Date(iYear, iMonth, 32).getDate();
}

function getWeekdaysInMonth(month: number, year: number) {
    var days = daysInMonth(month, year);

    var weekdays = 0;

    for (var i = 0; i < days; i++) {
        if (isWeekday(year, month, i + 1))
            weekdays++;
    }

    return weekdays;
}

//! Months
/// 0 - January
/// 1 - February
/// 2 - March
/// 3 - April
/// 4 - May
/// 5 - June
/// 6 - July
/// 7 - August
/// 8 - September
/// 9 - October
/// 10 - November
/// 11 - December


// fetch employee data
// get shift type
// fetch shifts
// get the intended shift type
// get the working days of shift
// calculate the working days based on the shift type


export function calculatePeriodWorkingDays(attendanceData: AttendanceData, workingDays: string[]) {
    let pwd: number = 0;

    const attendance: any = attendanceData.attendance;
    const months: string[] = Object.keys(attendance);

    months.forEach((month, monthIndex) => {

        const numberedDays: string[] = Object.keys(attendance[month]);

        numberedDays.forEach(day => {
            const date: moment.Moment = moment(`${attendanceData.attendancePeriod} ${day}, ${attendanceData.year}`, "MMMM DD, YYYY");
            const dayInString: string = days[date.day()];

            if (workingDays.includes(dayInString) === true) pwd++;
        });
    });

    // console.log("pwd: ", pwd);

    return pwd;
}

//? Use case
/* 
*   the input is attendance data for an employee
*   from the attendanceData, the function extracts the attendance values and calculates the number of days the user was present 
*/
