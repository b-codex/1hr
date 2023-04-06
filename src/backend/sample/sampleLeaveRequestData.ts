import { LeaveRequestData } from './../models/leaveRequestData';

// sample leave request data
const sampleLeaveRequestData: LeaveRequestData = {
    leaveRequest: "",
    leaveState: "",
    leaveStage: "",
    leaveType: "",
    authorizedDays: "",
    firstDayOfLeave: "",
    lastDayOfLeave: "",
    dayOfReturn: "",
    numberOfLeaveDaysRequested: 0,
    balanceLeaveDays: 0,
    comments: [],
}

// sample performance evaluation data
const samplePerformanceEvaluationData: any = {
    id: "",
    roundOfEvaluation: "",
    stage: "",
    performanceYear: 0,
    periodStart: "",
    periodEnd: "",
    campaignStartDate: "",
    campaignEndDate: "",
    employeeID: "",
    objectives: [
        {
            id: "",
            objectiveID: "",
            state: "",
            title: "",
            completionDate: "",
            result: "",
        }
    ],
    competencies: [
        {
            id: "",
            name: "",
            threshold: 0,
            value: 0,
            gradedBy: "",
        }
    ],
}

// sample competency assessment data
const sampleCompetencyAssessmentData: any = {
    id: "",
    name: "",
    threshold: 0,
}

// sample objective setting data
const sampleObjectiveSettingData: any = {
    id: "",
    objectiveID: "",
    state: "",
    title: "",
    description: "",
    specificity: "",
    measurability: "",
    attainability: "",
    relevancy: "",
    timePeriod: "",
    targetDate: "",
    comments: [
        {
            role: "manager",
            comment: "",
        },
        {
            role: "employee",
            comment: "",
        }
    ],
    completionRate: "",
    result: "",
}

// sample periodic options data
const periodicOptions: any = {
    id: "",
    timestamp: "",
    periodName: "",
    year: 0,
    evaluations: [
        {
            round: "",
            from: "",
            to: "",
        },
        {
            round: "",
            from: "",
            to: "",
        }
    ]
};