export interface SectionExtDtoErrors {
    sectionId: string;
    sectionGroupId: string;
    businessId: string;
    branchId: string;
    managerId: string;
    fullAddressId: string;
    sectionName: string;
    sectionCode: string;
    createdAt: string;
    updatedAt: string;
    
    // Extended With SectionGroup
    sectionGroupName: string;

    // Extended With Manager
    managerNameSurname: string;

    // Extended With FullAddress
    cityId: string;
    districtId: string;
    addressTitle: string;
    postalCode: string;
    addressText: string;

    // Extended With FullAddress + City
    cityName: string;

    // Extended With FullAddress + District
    districtName: string;
}