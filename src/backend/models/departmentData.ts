export interface DepartmentData {
    id?: string;
    name: string;
    size: string;
    deptHeadName: string;
    associatedSections: string[];
    associatedEmployees: string[];
    kpi: KPIData[];
}

interface KPIData {
    deptKPIYear: string;
    deptKPIDefinition: string;
    associatedCompanyObjective: string;
}