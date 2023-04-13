/* A shorthand for console.log. */
const log = console.log;

import { ObjectiveData } from '@/backend/models/objectiveData';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

// update objective
export const updateObjective = async (data: ObjectiveData, docID: string) => {

    let result: boolean = false;

    const docRef = doc(db, "objective", docID);

    result = await updateDoc(docRef, data as any)
        .then(() => true)
        .catch(err => {
            log(err);
            return false;
        });

    return result;

}
