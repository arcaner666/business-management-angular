export interface FlatExtDto {
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

    // Extended With Section
    sectionName: string;

    // Extended With Apartment
    apartmentName: string;

    // Extended With HouseOwner
    houseOwnerNameSurname: string;

    // Extended With Tenant
    tenantNameSurname: string;
}