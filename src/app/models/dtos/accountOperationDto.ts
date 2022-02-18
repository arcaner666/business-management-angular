export interface AccountOperationDto {
    accountOperationId: bigint;
    businessId: number;
    branchId: bigint;
    accountOperationTypeId: number;
    employeeId: bigint;
    accountOperationOrder: bigint;
    title: string;
    cancelled: boolean;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
}