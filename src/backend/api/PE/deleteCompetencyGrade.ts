import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

export async function deleteCompetencyAssessment(id: string, data?: any) {
    let result: boolean = false;

    await deleteDoc(doc(db, "competencyAssessment", id))
        .then(() => {
            result = true;
        })
        .catch(() => {
            result = false;
        });

    return result;
}
