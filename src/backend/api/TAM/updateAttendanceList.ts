/* A shorthand for console.log. */
const log = console.log;

import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { AttendanceData } from "../../models/attendanceData";

// update attendance
export async function updateAttendanceList(data: AttendanceData, docID: string) {
    let result: boolean = false;

    const docRef = doc(db, "attendance", docID);

    result = await updateDoc(docRef, data as any)
        .then(() => true)
        .catch(err => {
            log(err);
            return false;
        });

    return result;
}