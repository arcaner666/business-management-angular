export interface EmployeeDto {
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
}
 