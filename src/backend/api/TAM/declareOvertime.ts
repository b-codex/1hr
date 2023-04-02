/* A shorthand for console.log. */
const log = console.log;

import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

// declare overtime for an attendance list
export async function declareOvertime(docID: string, overtime: any[]) {
    let result: boolean = false;

    const update: any = {
        overtime: overtime,
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
