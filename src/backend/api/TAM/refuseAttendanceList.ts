/* A shorthand for console.log. */
const log = console.log;

import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { batchUpdate } from "../batch";

// refuse attendance list
export async function refuseAttendanceList(docID: string, by: "HR" | "LM") {
    let result: boolean = false;

    const update: any = {
        state: by === "HR" ? "Refused (HR)" : "Refused (LM)",
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

// refuse batch attendance list
export async function refuseBatchAttendanceList(ids: string[], by: "HR" | "LM") {
    let result: boolean = false;

    const dataArray: any[] = [];
    ids.forEach(id => {
        const update: any = {
            id: id,
            state: by === "HR" ? "Refused (HR)" : "Refused (LM)",
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