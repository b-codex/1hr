export interface CompetencyDefinitionData {
    id?: string;
    cid: string;
    name: string;
    competencyType: string;
    level: string;
    active: "Yes" | "No";
    startDate: string;
    endDate: string;
}