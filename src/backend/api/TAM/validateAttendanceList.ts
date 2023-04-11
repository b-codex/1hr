/* A shorthand for console.log. */
const log = console.log;

import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { batchUpdate } from "../batch";

// validate attendance list
export async function validateAttendanceList(docID: string) {
    let result: boolean = false;

    const update: any = {
        "state": "Validated",
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

// validate batch attendance list
export async function validateBatchAttendanceList(ids: string[]) {
    let result: boolean = false;

    const dataArray: any[] = [];
    ids.forEach(id => {
        const update: any = {
            "id": id,
            "state": "Validated",
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
