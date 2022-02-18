export interface BranchDto {
    branchId: bigint;
    businessId: number;
    fullAddressId: bigint;
    branchOrder: number;
    branchName: string;
    branchCode: string;
    createdAt: Date;
    updatedAt: Date;
}