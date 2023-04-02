import { onSnapshot, collection, QuerySnapshot, DocumentData } from "firebase/firestore";
import { db } from "./firebase";

/* Using the useEffect hook to listen to the collection "" in the database. */
export function onSnapshotFetch(collectionName: string) {
    const data: any[] = [];

    onSnapshot(collection(db, collectionName), (snapshot: QuerySnapshot<DocumentData>) => {
        snapshot.docs.map((doc) => {
            data.push({
                id: doc.id,
                ...doc.data()
            });
        });
    });

    return data;
};
