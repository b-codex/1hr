import { AttendanceData } from "../models/attendanceData";

/// sample attendance data
export const sampleAttendanceData: AttendanceData = {
    employeeID: "hFC57JbjDoC",
    attendancePeriod: "March",
    year: 2023,
    state: "Draft",
    comments: [],
    attendance: {
        "February": {
            "26": "P",
            "27": "A",
            "28": "H"
        },
        "March": {
            "1": "A",
            "2": "A",
            "3": "P",
            "4": "P"
        }
    },
    overtime: [
        {
            "date": "March 1, 2023",
            "overtime": "06:00 AM - 12:00 PM",
        }
    ],
    modificationRequested: false,
    modifications: [],
    stage: "",
    associatedShiftType: "Work Days",
};
