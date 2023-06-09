/* A shorthand for console.log. */
const log = console.log;

import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { batchUpdate } from "../batch";

// approve attendance list
export async function approveAttendanceList(docID: string) {
    let result: boolean = false;

    const update: any = {
        state: "Approved",
    };

    const docRef = doc(db, "attendance", docID);

    result = await updateDoc(docRef, update)
        .then(() => true)
        .catch(err => {
            log(err);
            return false;
        });

    return result;
}

// approve batch attendance list
export async function approveBatchAttendanceList(ids: string[]) {
    let result: boolean = false;

    const dataArray: any[] = [];
    ids.forEach(id => {
        const update: any = {
            id: id,
            state: "Approved",
        };

        dataArray.push(update);
    });


    result = await batchUpdate(dataArray, 'attendance')
        .then(() => true)
        .catch(err => {
            log(err);
            return false;
        });

    return result;
}
