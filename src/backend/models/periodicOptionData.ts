export interface PeriodicOptionData {
    id?: string;
    timestamp: string;
    periodName: string;
    year: number;
    evaluations: PeriodicOptionEvaluationsData[];
};

interface PeriodicOptionEvaluationsData {
    id?: string;
    round: string;
    from: string;
    to: string;
}