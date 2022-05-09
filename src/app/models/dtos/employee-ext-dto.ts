export interface EmployeeExtDto {
    employeeId: number;
    businessId: number;
    branchId: number;
    accountId: number;
    employeeTypeId: number;
    nameSurname: string;
    email: string;
    phone: string;
    dateOfBirth?: Date;
    gender: string;
    notes: string;
    avatarUrl: string;
    identityNumber: number;
    stillWorking: boolean;
    startDate: Date;
    quitDate?: Date;
    createdAt: Date;
    updatedAt: Date;

    // Extended With Account
    accountGroupId: number;
    accountOrder: number;
    accountName: string;
    accountCode: string;
    limit: number;
    
    // Extended With EmployeeType
    employeeTypeName: string;
}