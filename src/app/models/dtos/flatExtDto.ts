export interface FlatExtDto {
    flatId: number;
    sectionId: number;
    apartmentId: number;
    businessId: number;
    branchId: number;
    houseOwnerId?: number;
    tenantId?: number;
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