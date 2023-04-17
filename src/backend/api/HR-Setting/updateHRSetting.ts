import { log } from "console";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

// update hrSetting
export async function updateHRSetting(data: any, docID: string) {
    let result: boolean = false;

    const docRef = doc(db, "hrSettings", docID);

    result = await updateDoc(docRef, data as any)
        .then(() => true)
        .catch(err => {
            log(err);
            return false;
        });

    return result;
}
