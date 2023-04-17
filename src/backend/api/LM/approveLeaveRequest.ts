/* A shorthand for console.log. */
const log = console.log;

import { EmployeeData } from "@/backend/models/employeeData";
import { LeaveData } from "@/backend/models/leaveData";
import { doc, updateDoc } from "firebase/firestore";
import { batchUpdate } from "../batch";
import { db } from "../firebase";
import { fetchEmployees } from "../getFunctions";
import { updateEmployee } from "../HR-Manager/updateEmployee";

// approve leave request
export async function approveLeaveRequest(docID: string, leaveData: LeaveData) {
    let result: boolean = false;

    const update: any = {
        leaveStage: "Approved",
        leaveState: "Closed",
    };

    const docRef = doc(db, "leaveManagement", docID);

    result = await updateDoc(docRef, update)
        .then(() => true)
        .catch(err => {
            log(err);
            return false;
        });

    if (leaveData.leaveType === "Annual Paid Leave (Vacation)") {
        result = await updateEmployeeInfo(leaveData.employeeID, leaveData.numberOfLeaveDaysRequested)
            .then(() => true)
            .catch(err => {
                log(err);
                return false;
            });
    }

    return result;
}

// approve batch leave request
export async function approveBatchLeaveRequest(ids: string[], allLeaveData: LeaveData[]) {
    let result: boolean = false;

    const dataArray: any[] = [];

    for (const id of ids) {
        const leaveRequest = allLeaveData.find(leaveData => leaveData.id === id) as LeaveData;
        const eid: string = leaveRequest.employeeID;

        if (leaveRequest.leaveType === "Annual Paid Leave (Vacation)") {
            await updateEmployeeInfo(eid, leaveRequest.numberOfLeaveDaysRequested)
        }
        else {
            const update: any = {
                id: id,
                leaveStage: "Approved",
            };

            dataArray.push(update);
        }
    }

    result = await batchUpdate(dataArray, 'leaveManagement')
        .then(() => true)
        .catch(err => {
            log(err);
            return false;
        });

    return result;
}

// update ELD if leave type is annual
async function updateEmployeeInfo(employeeID: string, numberOfLeaveDaysRequested: number) {
    let result: boolean = false;

    const employees: any[] = await fetchEmployees();
    const employee: EmployeeData = employees.find(employee => employee.employeeID === employeeID);

    const eld: number = (employee.eligibleLeaveDays ?? 0) - numberOfLeaveDaysRequested;
    const nolt: number = (employee.numberOfLeaveDaysTaken ?? 0) + numberOfLeaveDaysRequested;

    const update: any = {
        eligibleLeaveDays: eld,
        numberOfLeaveDaysTaken: nolt,
    };

    // console.log(update)

    result = await updateEmployee(update, employee.id as string)
        .then(() => true)
        .catch(err => {
            log(err);
            return false;
        });

    return result;
}