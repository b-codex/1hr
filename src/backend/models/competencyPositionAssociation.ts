export interface CompetencyPositionAssociationData {
    id?: string;
    pid: string;
    cid: string;
    grade: number;
    threshold: number;
    active: "Yes" | "No";
}