// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./firebase-config";

/* Importing the functions from the firestore.js file. */
import {
    collection,
    doc,
    getFirestore,
    writeBatch
} from "firebase/firestore";

/* A shorthand for console.log. */
const log = console.log;

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// initialize the firestore instance
const db = getFirestore(app);

// Get a new write batch
const batch = writeBatch(db);

//? Batch Add
export const batchAdd = async (dataArray: any[], collectionName: string) => {
    const batch = writeBatch(db);

    dataArray.map((data: any) => {
        const newDoc = doc(collection(db, collectionName));

        data.id = newDoc.id;

        batch.set(newDoc, data);
    });

    let result: boolean = false;

    result = await batch.commit().then(() => true)
        .catch(err => {
            log(err);
            return false;
        });

    return result;
}

//? Batch Update
export const batchUpdate = async (dataArray: any[], collectionName: string) => {
    const batch = writeBatch(db);

    dataArray.map((data: any) => {
        const docRef = doc(db, collectionName, data.id);

        batch.update(docRef, data);
    });

    let result: boolean = false;

    result = await batch.commit().then(() => true)
        .catch(err => {
            log(err);
            return false;
        });

    return result;
}

//? Batch Delete
export const batchDelete = async (ids: string[], collectionName: string) => {

    ids.map((id: string) => {
        const docRef = doc(db, `${collectionName}`, id);

        batch.delete(docRef);
    });

    let result: boolean = false;

    result = await batch.commit().then(() => true)
        .catch(err => {
            log(err);
            return false;
        });

    return result;
}
