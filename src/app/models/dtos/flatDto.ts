export interface FlatDto {
    flatId: bigint;
    sectionId: number;
    apartmentId: bigint;
    businessId: number;
    branchId: bigint;
    houseOwnerId: bigint;
    tenantId: bigint;
    flatCode: string;
    doorNumber: number;
    createdAt: Date;
    updatedAt: Date;
}