export interface ApartmentExtDtoErrors {
    apartmentId: string;
    sectionId: string;
    businessId: string;
    branchId: string;
    managerId: string;
    apartmentName: string;
    apartmentCode: string;
    blockNumber: string;
    createdAt: string;
    updatedAt: string;
    
    // Extended With Section
    sectionName: string;

    // Extended With Manager
    managerNameSurname: string;
}