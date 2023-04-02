import { log } from "console";
import { getDocs, query, where } from "firebase/firestore";
import { usersCollection } from "../firebase";

// login function
export const login = async (email: string, password: string) => {
    let user: any;

    const q = query(usersCollection, where("email", "==", email), where("password", "==", password));

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
            log("Catching Error On Login Function: ", e);
            return e
        });

    log("user: ", user?.id, "\nif user is 'undefined', then no account found");
    return user;
}
