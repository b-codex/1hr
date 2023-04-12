/* A shorthand for console.log. */
const log = console.log;

import { months } from "@/backend/constants/months";
import { AttendanceData, ModificationData } from "@/backend/models/attendanceData";
import dayjs from "dayjs";
import { fetchAttendanceList } from "../getFunctions";
import { updateAttendanceList } from "./updateAttendanceList";

// approve attendance modification
export async function approveAttendanceModification(attendanceData: AttendanceData, modification: ModificationData) {
    let result: boolean = false;

    const allAttendances: any[] = await fetchAttendanceList();

    const filteredAttendances: any[] = allAttendances.filter(attendance => attendance.employeeID === attendanceData.employeeID);
    const periodData: any = filteredAttendances.find(attendance => attendance.attendancePeriod === attendanceData.attendancePeriod);
    const data: any = periodData.attendance;

    const year: number = attendanceData.attendancePeriod === "January" ? attendanceData.year - 1 : attendanceData.year;

    const date: dayjs.Dayjs = dayjs(`${modification.date} ${year}`);
    const day: number = date.get("date");
    const month: string = months[date.month()];

    data[month][day] = modification.new;
    attendanceData.modifications.forEach((md: ModificationData) => {
        if (md.date === modification.date) md.state = "Approved";
    });

    attendanceData.attendance = data;

    // console.log(attendanceData);

    result = await updateAttendanceList(attendanceData, attendanceData.id as string)
        .then(() => true)
        .catch(err => {
            log(err);
            return false;
        });

    return result;
}

//? data needed to update
// employee id
// attendance period
// date of the requested modification
// new presence