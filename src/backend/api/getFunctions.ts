import { DocumentData, QuerySnapshot, getDocs, query, where } from "firebase/firestore";
import { attendanceCollection, employeeCollection, hrSettingsCollection, performanceEvaluationCollection } from "./firebase";
import { groupBy } from "../constants/groupBy";

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

export const fetchEvaluationCampaigns = async () => {
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

            const groupedSettings: any = groupBy("type", data);
            const evaluationCampaigns: any[] = groupedSettings['Evaluation Campaign'] ?? [];

            return evaluationCampaigns;
        })
        .catch((e: any) => {
            console.log("Catching while fetching Employee List: ", e);
            return [];
        });

    return response;
}

export const fetchEvaluationCampaign = async (name: string) => {
    const q = query(hrSettingsCollection, where("periodName", "==", name));

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

export const fetchMonitoringPeriods = async () => {
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

            const groupedSettings: any = groupBy("type", data);
            const monitoringPeriods: any[] = groupedSettings['Monitoring Period'] ?? [];

            return monitoringPeriods;
        })
        .catch((e: any) => {
            console.log("Catching while fetching Employee List: ", e);
            return [];
        });

    return response;
}

export const fetchPeriodicOption = async (name: string) => {
    const q = query(hrSettingsCollection, where("periodName", "==", name));

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

export const fetchPerformanceEvaluations = async () => {
    const q = query(performanceEvaluationCollection);

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
            console.log("Catching while fetching performance evaluations: ", e);
            return [];
        });

    return response;
}