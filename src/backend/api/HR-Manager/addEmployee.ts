import { days } from "@/backend/constants/days";
import { groupBy } from "@/backend/constants/groupBy";
import { daysInMonth } from "@/backend/functions/periodWorkingDays";
import { AttendanceData } from "@/backend/models/attendanceData";
import { EmployeeData } from "@/backend/models/employeeData";
import dayjs from "dayjs";
import { doc, setDoc } from "firebase/firestore";
import moment from "moment";
import { batchAdd } from "../batch";
import { employeeCollection } from "../firebase";
import { fetchEmployees, fetchHRSettings } from "../getFunctions";
import { months } from "@/backend/constants/months";
/* A shorthand for console.log. */
const log = console.log;

// add employee
export const addEmployee = async (data: EmployeeData) => {
    const firstName: string = data.firstName;
    const lastName: string = data.lastName;
    const birthDate: dayjs.Dayjs = dayjs(data.birthDate);
    const day: number = birthDate.date();
    const month: number = birthDate.get('month');
    const year: number = birthDate.get('year');

    let eid: string = `${firstName.toLowerCase().at(0)}${lastName.toLowerCase().slice(0, 2)}-${day.toString().at(0)}${month.toString().at(0)}${year.toString().at(0)}`;

    // check if that employee id is already assigned
    const employees = await fetchEmployees() as EmployeeData[];
    const listOfIDs: string[] = employees.map((employee) => employee.employeeID) as string[];
    if (listOfIDs.includes(eid)) eid = eid + `-${listOfIDs.length}`;

    data.employeeID = eid;
    const hrSettings: any[] = await fetchHRSettings();

    const groupedHRSettings: any = groupBy("type", hrSettings);
    const shiftTypes: any[] = groupedHRSettings['Shift Type'];

    /* Filtering the shiftTypes array and returning the first element of the filtered array. */
    const selectedShift: any = shiftTypes.filter(shiftType => shiftType.name === data.shiftType).at(0) ?? null;

    /* Checking if the selectedShift is not null, if it is not null, then it will return the
    workingDays array from the selectedShift object. If it is null, then it will return an empty
    array. */
    const workingDays: string[] = selectedShift !== null ? selectedShift.workingDays : [];

    let result: boolean = false;

    const newEmployee = doc(employeeCollection);

    result = await setDoc(newEmployee, { ...data, id: newEmployee.id, })
        .then(async () => {

            let res: boolean = false;

            //? adding attendance data to attendance collection specific to this user
            const attendanceDataList: AttendanceData[] = [];

            const year: number = moment().year();

            // need to generate 12 documents for each month
            for (let index = 0; index < months.length; index++) {
                const month: string = months[index];
                const attendanceData: AttendanceData = {
                    employeeID: eid,
                    attendancePeriod: month,
                    year: year,
                    state: "Draft",
                    comments: [],
                    attendance: {},
                    overtime: [],
                    modificationRequested: false,
                    modifications: [],
                    stage: "",
                    associatedShiftType: data.shiftType,
                };

                /* Checking if the index is 0, if it is 0, then it will return the last element of the
                months array, else it will return the previous month. */
                const pastMonth: string = months[index - 1] === undefined ? months.slice(-1)[0] : months[index - 1];

                /* Getting the number of days in the past month. */
                const daysInThePastMonth: number = daysInMonth(months.indexOf(pastMonth), year);

                /* Getting the number of days in a month. */
                const daysInAMonth: number = daysInMonth(index, year);

                /* Creating an empty object for the past month and the current month. */
                attendanceData.attendance[pastMonth] = {};
                attendanceData.attendance[month] = {};

                /* Checking if the months[index - 1] is undefined, if it is undefined, returns the year - 1. if it is not undefined, returns the current year */
                // const y: number = months[index - 1] === undefined ? year - 1 : year;
                const y: number = month === "January" ? year - 1 : year;

                /* Assigning present or absent values for the past month */
                for (let index = 1; index <= daysInThePastMonth; index++) {
                    if (index >= 26) {
                        const date: moment.Moment = moment(`${pastMonth} ${index}, ${y}`);
                        const day: string = days[date.day()];

                        const presentOrAbsent: boolean = workingDays.includes(day);
                        attendanceData.attendance[pastMonth][index] = presentOrAbsent ? "P" : null;
                    }
                }

                /* Assigning present or absent values for the current month */
                for (let index = 1; index <= daysInAMonth; index++) {
                    if (index < 26) {
                        const date: moment.Moment = moment(`${month} ${index}, ${y}`);
                        const day: string = days[date.day()];

                        const presentOrAbsent: boolean = workingDays.includes(day);
                        attendanceData.attendance[month][index] = presentOrAbsent ? "P" : null;
                    }
                }

                attendanceDataList.push(attendanceData);
            }

            res = await batchAdd(attendanceDataList, "attendance")
                .then((res: boolean) => res)
                .catch((err: string) => {
                    console.log("error adding batch: ", err);
                    return false;
                });

            return res;

        })
        .catch(err => {
            log(err);
            return false;
        });

    return result;

}
