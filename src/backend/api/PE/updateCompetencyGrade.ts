/* A shorthand for console.log. */
const log = console.log;

import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { CompetencyAssessmentData } from '@/backend/models/competencyAssessmentData';

// update competency assessment
export const updateCompetencyAssessment = async (data: CompetencyAssessmentData, docID: string) => {

    let result: boolean = false;

    const docRef = doc(db, "competencyAssessment", docID);

    result = await updateDoc(docRef, data as any)
        .then(() => true)
        .catch(err => {
            log(err);
            return false;
        });

    return result;

}
