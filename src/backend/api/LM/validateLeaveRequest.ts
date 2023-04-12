/* A shorthand for console.log. */
const log = console.log;

import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { batchUpdate } from "../batch";

// validate leave request
export async function validateLeaveRequest(docID: string) {
    let result: boolean = false;

    const update: any = {
        leaveStage: "Validated",
    };

    const docRef = doc(db, "leaveManagement", docID);

    result = await updateDoc(docRef, update)
        .then(() => true)
        .catch(err => {
            log(err);
            return false;
        });

    return result;
}

// validate batch leave request
export async function validateBatchLeaveRequest(ids: string[]) {
    let result: boolean = false;

    const dataArray: any[] = [];
    ids.forEach(id => {
        const update: any = {
            id: id,
            leaveStage: "Validated",
        };

        dataArray.push(update);
    });


    result = await batchUpdate(dataArray, 'leaveManagement')
        .then(() => true)
        .catch(err => {
            log(err);
            return false;
        });

    return result;
}
