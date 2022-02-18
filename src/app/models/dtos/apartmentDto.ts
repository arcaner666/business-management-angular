export interface ApartmentDto {
    apartmentId: bigint;
    sectionId: number;
    businessId: number;
    branchId: bigint;
    managerId: bigint;
    apartmentName: string;
    apartmentCode: string;
    blockNumber: number;
    createdAt: Date;
    updatedAt: Date;
}