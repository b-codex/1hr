import { doc, setDoc } from "firebase/firestore";
import { employeeInfoChangeRequestCollection } from "../firebase";

// employeeInfoChangeRequestAdd
export const employeeInfoChangeRequestAdd = async (data: any) => {

    let result: boolean = false;

    const newDoc = doc(employeeInfoChangeRequestCollection);

    result = await setDoc(newDoc, { ...data, id: newDoc.id, })
        .then(() => true)
        .catch(err => {
            console.log(err);
            return false;
        });

    return result;

}