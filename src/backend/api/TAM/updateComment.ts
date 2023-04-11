/* A shorthand for console.log. */
const log = console.log;

import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { CommentData } from './../../models/attendanceData';

// update comment for an attendance list
export async function updateComment(docID: string, comments: CommentData[]) {
    let result: boolean = false;

    const update: any = {
        comments: comments,
    };

    const docRef = doc(db, "attendance", docID);

    result = await updateDoc(docRef, update)
        .then(() => true)
        .catch(err => {
            log(err);
            return false;
        });

    return result;
}
