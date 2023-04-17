import { doc, setDoc } from 'firebase/firestore';
import { CompetencyAssessmentData } from '@/backend/models/competencyAssessmentData';
import { competencyAssessmentCollection } from '../firebase';
import { fetchCompetencyAssessments } from '../getFunctions';
import { updateCompetencyAssessment } from './updateCompetencyGrade';

// add competency assessment
export const addCompetencyAssessment = async (data: CompetencyAssessmentData) => {

    let result: boolean = false;

    const newData = doc(competencyAssessmentCollection);

    const allCompetencyAssessments: any[] = await fetchCompetencyAssessments();
    const forThisEmployee = allCompetencyAssessments.find(competencyAssessment => competencyAssessment.for === data.for) as CompetencyAssessmentData;

    if (forThisEmployee) {
        const oldAssessment: any[] = forThisEmployee.assessment;
        const newAssessment: any[] = data.assessment;

        const currentUserAlreadySubmittedAssessment = oldAssessment.filter(assessment => assessment.evaluatedBy === newAssessment[0].evaluatedBy);
        if (currentUserAlreadySubmittedAssessment.length > 0) {
            result = false;
        }
        else {
            const allAssessments = [...oldAssessment, ...newAssessment];

            const newUpdate: CompetencyAssessmentData = {
                timestamp: forThisEmployee.timestamp,
                for: forThisEmployee.for,
                assessment: allAssessments,
            };

            result = await updateCompetencyAssessment(newUpdate, forThisEmployee.id as string)
                .then(() => true)
                .catch(err => {
                    console.log(err);
                    return false;
                });
        }
    }
    else {
        result = await setDoc(newData, { ...data, id: newData.id, })
            .then(() => true)
            .catch(err => {
                console.log(err);
                return false;
            });
    }

    return result;
}
