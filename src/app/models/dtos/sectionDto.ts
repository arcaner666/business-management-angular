export interface SectionDto {
    sectionId: number;
    sectionGroupId: bigint;
    businessId: number;
    branchId: bigint;
    managerId: bigint;
    fullAddressId: bigint;
    sectionName: string;
    sectionCode: string;
    createdAt: Date;
    updatedAt: Date;
}