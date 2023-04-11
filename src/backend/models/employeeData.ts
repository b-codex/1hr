export interface EmployeeData {
    id?: string;

    /// employee information
    firstName: string,
    lastName: string,
    birthDate: string,
    birthPlace: string,
    gender: string,
    maritalStatus: string,
    personalPhoneNumber: string,
    personalEmail: string,
    bankAccount: string,
    tinNumber: string,
    employeeID?: string,
    password?: string,

    /// contract information
    contractType: string,
    contractStatus: string,
    contractStartingDate: string,
    contractTerminationDate: string,
    probationPeriodEndDate: string,
    lastDateOfProbation: string,
    reasonOfLeaving: string,
    salary: string,
    eligibleLeaveDays: number,
    numberOfLeaveDaysTaken: number,
    companyEmail: string,
    companyPhoneNumber: string,

    /// position information
    employmentPosition: string,
    positionLevel: string,
    section: string,
    department: string,
    workingLocation: string,
    managerPosition: boolean,
    reportees: string[],
    reportingLineManagerPosition: string,
    reportingLineManagerName: string,
    gradeLevel: string,
    band: string | null,
    shiftType: string,
    transportAllowance: string,
    mobileAllowance: string,
    otherAllowance: string,
    role: string[],
};
