export interface ApartmentExtDto {
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
    
    // Extended With Section
    sectionName: string;

    // Extended With Manager
    managerNameSurname: string;

    // Extended With Section + FullAddress
    addressText: string;
}