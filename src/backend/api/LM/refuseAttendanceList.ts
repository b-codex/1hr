/* A shorthand for console.log. */
const log = console.log;

import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { batchUpdate } from "../batch";

// refuse leave request
export async function refuseLeaveRequest(docID: string, by: "HR" | "LM") {
    let result: boolean = false;

    const update: any = {
        leaveStage: by === "HR" ? "Refused (HR)" : "Refused (LM)",
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

// refuse batch leave request
export async function refuseBatchLeaveRequest(ids: string[], by: "HR" | "LM") {
    let result: boolean = false;

    const dataArray: any[] = [];
    ids.forEach(id => {
        const update: any = {
            id: id,
            leaveStage: by === "HR" ? "Refused (HR)" : "Refused (LM)",
            state: by === "HR" && "Closed",
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