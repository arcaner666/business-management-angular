export interface ApartmentExtDto {
    apartmentId: number;
    sectionId: number;
    businessId: number;
    branchId: number;
    managerId: number;
    apartmentName: string;
    apartmentCode: string;
    blockNumber: number;
    createdAt: Date;
    updatedAt: Date;
    
    // Extended With Section
    sectionName: string;

    // Extended With Manager
    managerNameSurname: string;
}