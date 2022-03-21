export interface AccountOperationDto {
    accountOperationId: number;
    businessId: number;
    branchId: number;
    accountOperationTypeId: number;
    employeeId: number;
    accountOperationOrder: number;
    title: string;
    cancelled: boolean;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
}