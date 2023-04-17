export interface CompetencyAssessmentData {
    id?: string;
    timestamp: string;
    for: string;
    assessment: AssessmentData[]
}

interface AssessmentData {
    evaluatedBy: string;
    competencyValues: any;
}