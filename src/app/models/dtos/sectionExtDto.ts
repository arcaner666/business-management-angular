export interface SectionExtDto {
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
    
    // Extended With SectionGroup
    sectionGroupName: string;

    // Extended With Manager
    managerNameSurname: string;

    // Extended With FullAddress
    cityId: number;
    districtId: number;
    addressTitle: string;
    postalCode: number;
    addressText: string;

    // Extended With FullAddress + City
    cityName: string;

    // Extended With FullAddress + District
    districtName: string;
}