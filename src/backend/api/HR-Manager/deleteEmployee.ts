import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

// delete employee
export async function deleteEmployee(id: string) {
    let result: boolean = await deleteDoc(doc(db, "employee", id))
        .then(() => {
            return true;
        })
        .catch(() => {
            return false;
        });

    return result;
}
