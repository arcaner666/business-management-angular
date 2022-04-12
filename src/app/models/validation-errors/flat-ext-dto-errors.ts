export interface FlatExtDtoErrors {
    flatId: string;
    sectionId: string;
    apartmentId: string;
    businessId: string;
    branchId: string;
    houseOwnerId?: string;
    tenantId?: string;
    flatCode: string;
    doorNumber: string;
    createdAt: string;
    updatedAt: string;

    // Extended With Section
    sectionName: string;

    // Extended With Apartment
    apartmentName: string;

    // Extended With HouseOwner
    houseOwnerNameSurname: string;

    // Extended With Tenant
    tenantNameSurname: string;
}