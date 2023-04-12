/* A shorthand for console.log. */
const log = console.log;

import { AttendanceData, ModificationData } from "@/backend/models/attendanceData";
import { fetchAttendanceList } from "../getFunctions";
import { updateAttendanceList } from "./updateAttendanceList";

// refuse attendance modification
export async function refuseAttendanceModification(attendanceData: AttendanceData, modification: ModificationData) {
    let result: boolean = false;

    const allAttendances: any[] = await fetchAttendanceList();

    const filteredAttendances: any[] = allAttendances.filter(attendance => attendance.employeeID === attendanceData.employeeID);
    const periodData: any = filteredAttendances.find(attendance => attendance.attendancePeriod === attendanceData.attendancePeriod);
    const data: any = periodData.attendance;

    attendanceData.modifications.forEach((md: ModificationData) => {
        if (md.date === modification.date) md.state = "Refused";
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