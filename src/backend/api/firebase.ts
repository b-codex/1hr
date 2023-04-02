import { days } from './../constants/days';
import { groupBy } from './../constants/groupBy';
import { months } from './../constants/months';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./firebase-config";

/* Importing the functions from the firestore.js file. */
import {
    collection,
    deleteDoc,
    doc,
    getFirestore,
    setDoc,
    updateDoc
} from "firebase/firestore";
import moment from "moment";
import { daysInMonth } from '../functions/periodWorkingDays';
import { AttendanceData } from "../models/attendanceData";
import { EmployeeData } from "../models/employeeData";
import { batchAdd } from './batch';
import { fetchHRSettings } from './getFunctions';

/* A shorthand for console.log. */
const log = console.log;

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// initialize the firestore instance
export const db = getFirestore(app);

// collection ref
export const usersCollection = collection(db, "users");
export const employeeCollection = collection(db, "employee");
export const attendanceCollection = collection(db, "attendance");
export const hrSettingsCollection = collection(db, "hrSettings");
export const leaveManagementCollection = collection(db, "leaveManagement");

// add employee
export const addEmployee = async (data: EmployeeData) => {

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
                    employeeID: newEmployee.id,
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
                const y: number = months[index - 1] === undefined ? year - 1 : year;

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

// update employee
export async function updateEmployee(data: EmployeeData, docID: string) {
    let result: boolean = false;

    const docRef = doc(db, "employee", docID);

    result = await updateDoc(docRef, data as any)
        .then(() => true)
        .catch(err => {
            log(err);
            return false;
        });

    return result;
}

// delete employee
export async function deleteEmployee(id: string) {
    let result: boolean = await deleteDoc(doc(db, "employee", id))
        .then(() => {
            return result = true;
        })
        .catch(() => {
            return result = false;
        });

    return result;
}

