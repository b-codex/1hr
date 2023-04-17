import { days } from './../constants/days';
import { groupBy } from './../constants/groupBy';
import { months } from './../constants/months';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./firebase-config";

/* Importing the functions from the firestore.js file. */
import dayjs from 'dayjs';
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
import { fetchEmployees, fetchHRSettings, fetchPerformanceEvaluations, fetchPeriodicOption } from './getFunctions';

/* A shorthand for console.log. */
const log = console.log;

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// initialize the firestore instance
export const db = getFirestore(app);

// collection ref
export const employeeCollection = collection(db, "employee");
export const attendanceCollection = collection(db, "attendance");
export const hrSettingsCollection = collection(db, "hrSettings");
export const leaveManagementCollection = collection(db, "leaveManagement");
export const performanceEvaluationCollection = collection(db, "performanceEvaluation");
export const employeeInfoChangeRequestCollection = collection(db, "employeeInfoChangeRequest");
export const objectiveCollection = collection(db, "objective");
export const competencyAssessmentCollection = collection(db, "competencyAssessment");

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

// update employee
export async function updateEmployee(data: EmployeeData | any, docID: string) {
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
            return true;
        })
        .catch(() => {
            return false;
        });

    return result;
}

// add hrSetting
export const addHRSetting = async (data: any) => {

    let result: boolean = false;

    if (data.type === "Evaluation Campaign") {
        const period: string = data.period;
        const round: string = data.round;
        const campaignName: string = data.campaignName;
        const campaignStartDate: string = data.startDate;
        const campaignEndDate: string = data.endDate;

        const periodicOptionData: any = (await fetchPeriodicOption(period)).at(0);
        const chosenRound: any = periodicOptionData.evaluations.find((val: any) => val.round === round);
        const from: string = chosenRound.from;
        const to: string = chosenRound.to;

        const newDataArray: any[] = [];

        const employees: any[] = await fetchEmployees();
        employees.forEach(employee => {
            const newData: any = {
                employeeID: employee.employeeID,
                roundOfEvaluation: round,
                stage: "",
                performanceYear: periodicOptionData.year,
                periodStart: from,
                periodEnd: to,
                campaignStartDate: campaignStartDate,
                campaignEndDate: campaignEndDate,
                campaignName: campaignName,
            };

            newDataArray.push(newData);
        });

        // console.log("newDataArray: ", newDataArray);

        const newDoc = doc(hrSettingsCollection);
        result = await setDoc(newDoc, { ...data, id: newDoc.id, })
            .then(async () => {
                return await batchAdd(newDataArray, 'performanceEvaluation');
            })
            .catch(err => {
                console.log(err);
                return false;
            });
    }

    else {
        const newDoc = doc(hrSettingsCollection);

        result = await setDoc(newDoc, { ...data, id: newDoc.id, })
            .then(() => true)
            .catch(err => {
                console.log(err);
                return false;
            });
    }

    return result;
}

export async function updateHRSetting(data: any, docID: string) {
    let result: boolean = false;

    const docRef = doc(db, "hrSettings", docID);

    result = await updateDoc(docRef, data as any)
        .then(() => true)
        .catch(err => {
            log(err);
            return false;
        });

    return result;
}

export async function deleteHRSetting(id: string, data?: any) {
    let result: boolean = false;

    if (data !== undefined) {
        if (data.type === "Periodic Option") {
            const idArrayHRSettings: string[] = [id];
            const idArrayPE: string[] = [];

            const periodName: string = data.periodName;

            // fetch all HR settings
            const allHRSettings: any[] = await fetchHRSettings();
            const groupedHRSettings: any = groupBy("type", allHRSettings);

            // from evaluation campaign, find the docs with the same period name
            const evaluationCampaigns: any[] = groupedHRSettings['Evaluation Campaign'] ?? []
            const evaluationCampaignsByPeriodName: any[] = evaluationCampaigns.filter(c => c.period === periodName);
            evaluationCampaignsByPeriodName.forEach(c => idArrayHRSettings.push(c.id));

            // from monitoring period, find the docs with the same period name
            const monitoringPeriods: any[] = groupedHRSettings['Monitoring Period'] ?? []
            const monitoringPeriodsByPeriodName: any[] = monitoringPeriods.filter(c => c.period === periodName);
            monitoringPeriodsByPeriodName.forEach(m => idArrayHRSettings.push(m.id));

            // from performance evaluation, find the docs with the same period name
            const performanceEvaluations: any[] = await fetchPerformanceEvaluations();
            evaluationCampaignsByPeriodName.forEach(c => {
                const campaignName: string = c.campaignName;
                const performanceEvaluationByCampaignName: any[] = performanceEvaluations.filter(e => e.campaignName === campaignName);

                performanceEvaluationByCampaignName.forEach(p => idArrayPE.push(p.id));
            });

            // delete from hrSettings collection
            for (const id of idArrayHRSettings) {
                await deleteDoc(doc(db, "hrSettings", id))
                    .then(() => {
                        result = true;
                    })
                    .catch(() => {
                        result = false;
                    });
            }

            // delete from performanceEvaluation collection
            for (const id of idArrayPE) {
                await deleteDoc(doc(db, "performanceEvaluation", id))
                    .then(() => {
                        result = true;
                    })
                    .catch(() => {
                        result = false;
                    });
            }
        }
    }

    await deleteDoc(doc(db, "hrSettings", id))
        .then(() => {
            result = true;
        })
        .catch(() => {
            result = false;
        });

    return true;
}
