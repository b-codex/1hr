import { getDocs, query, where } from "firebase/firestore";
import { employeeCollection } from "../firebase";

// login function
export const login = async (employeeID: string, password: string) => {
    let user: any;

    const q = query(employeeCollection, where("employeeID", "==", employeeID), where("password", "==", password));

    await getDocs(q)
        .then((data: any) => {
            if (data.empty === true) {
                return [];
            }

            if (data.empty === false) {
                user = data.docs[0].data();
            }
        })
        .catch((e: any) => {
            console.log("Catching Error On Login Function: ", e);
            return e
        });

    // console.log("user: ", user?.id, "\nif user is 'undefined', then no account found");
    return user;
}
