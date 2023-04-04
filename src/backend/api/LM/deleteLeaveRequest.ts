import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

// delete leaveRequest
export async function deleteLeaveRequest(id: string) {
    let result: boolean = await deleteDoc(doc(db, "leaveManagement", id))
        .then(() => {
            return true;
        })
        .catch(() => {
            return false;
        });

    return result;
}