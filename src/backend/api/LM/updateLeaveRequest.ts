import { log } from "console";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { LeaveRequestData } from "../../models/leaveRequestData";

// update leaveRequest
export async function updateLeaveRequest(data: LeaveRequestData, docID: string) {
    let result: boolean = false;

    const docRef = doc(db, "leaveManagement", docID);

    result = await updateDoc(docRef, data as any)
        .then(() => true)
        .catch(err => {
            log(err);
            return false;
        });

    return result;
}
