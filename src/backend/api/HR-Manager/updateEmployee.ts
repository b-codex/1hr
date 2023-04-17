import { EmployeeData } from "@/backend/models/employeeData";
import { log } from "console";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

// update employee
export async function updateEmployee(data: EmployeeData | any, docID: string) {
    let result: boolean = false;

    const docRef = doc(db, "employee", docID);

    result = await updateDoc(docRef, data as any)
        .then(() => true)
        .catch(err => {
            log(err);
            return false;
        });

    return result;
}