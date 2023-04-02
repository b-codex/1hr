import { DocumentData, QuerySnapshot, getDocs, query, where } from "firebase/firestore";
import { attendanceCollection, employeeCollection, hrSettingsCollection } from "./firebase";

export const fetchHRSettings = async () => {
    const q = query(hrSettingsCollection);

    const response: any[] = await getDocs(q)
        .then((snapshot: QuerySnapshot<DocumentData>) => {
            const data: any[] = [];
            snapshot.docs.map((doc) => {
                data.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            return data;
        })
        .catch((e: any) => {
            console.log("Catching while fetching HR Settings: ", e);
            return [];
        });

    return response;
}

export const fetchAttendanceList = async () => {
    const q = query(attendanceCollection);

    const response: any[] = await getDocs(q)
        .then((snapshot: QuerySnapshot<DocumentData>) => {
            const data: any[] = [];
            snapshot.docs.map((doc) => {
                data.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            return data;
        })
        .catch((e: any) => {
            console.log("Catching while fetching Attendance List: ", e);
            return [];
        });

    return response;
}

export const fetchEmployees = async () => {
    const q = query(employeeCollection);

    const response: any[] = await getDocs(q)
        .then((snapshot: QuerySnapshot<DocumentData>) => {
            const data: any[] = [];
            snapshot.docs.map((doc) => {
                data.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            return data;
        })
        .catch((e: any) => {
            console.log("Catching while fetching Employee List: ", e);
            return [];
        });

    return response;
}

export const fetchEmployee = async (id: string) => {
    const q = query(employeeCollection, where("id", "==", id));

    const response: any[] = await getDocs(q)
        .then((snapshot: QuerySnapshot<DocumentData>) => {
            const data: any[] = [];
            snapshot.docs.map((doc) => {
                data.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            return data;
        })
        .catch((e: any) => {
            console.log("Catching while fetching Employee List: ", e);
            return [];
        });

    return response;
}