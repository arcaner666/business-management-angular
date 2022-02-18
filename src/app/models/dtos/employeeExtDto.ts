export interface EmployeeExtDto {
    employeeId: bigint;
    businessId: number;
    branchId: bigint;
    accountId: bigint;
    employeeTypeId: number;
    nameSurname: string;
    email: string;
    phone: string;
    dateOfBirth: Date;
    gender: string;
    notes: string;
    avatarUrl: string;
    stillWorking: boolean;
    startDate: Date;
    quitDate: Date;
    createdAt: Date;
    updatedAt: Date;

    // Extended With EmployeeType
    employeeTypeName: string;
}