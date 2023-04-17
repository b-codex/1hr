export interface ObjectiveData {
    timestamp: string;
    id?: string;
    objectiveID: string;
    state: string;
    title: string;
    relatedKPI?: string;
    specificity: string;
    measurability: string;
    attainability: string;
    relevancy: string;
    timePeriod: string;
    targetDate: string;
    completionDate: string;
    employees: string[];
    roundOfEvaluation: string;
    performanceYear: number;
    objectiveResult: string;
    completionRate: string;
    employeeComment: any[];
    managerComment: any[];
}