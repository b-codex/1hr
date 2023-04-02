// import { log } from "console";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

// request attendance list modification
export const requestAttendanceListModification = async (docID: string, modifications: any[]) => {
    let result: boolean = false;

    const update: any = {
        modificationRequested: true,
        modifications: modifications
    };

    const docRef = doc(db, "attendance", docID);

    result = await updateDoc(docRef, update)
        .then(() => true)
        .catch(err => {
            console.log(err);
            return false;
        });

    return result;
}
