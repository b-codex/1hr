/* A shorthand for console.log. */
const log = console.log;

import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

// refuse attendance list
export async function refuseAttendanceList(docID: string) {
    let result: boolean = false;

    const update: any = {
        "state": "Draft",
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
