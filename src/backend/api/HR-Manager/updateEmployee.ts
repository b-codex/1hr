import { EmployeeData } from "@/backend/models/employeeData";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

/* A shorthand for console.log. */
const log = console.log;

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