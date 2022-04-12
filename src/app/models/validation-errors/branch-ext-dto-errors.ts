export interface BranchExtDtoErrors {
    branchId: string;
    businessId: string;
    fullAddressId: string;
    branchOrder: string;
    branchName: string;
    branchCode: string;
    createdAt: string;
    updatedAt: string;

    // Extended With FullAddress
    cityId: string;
    districtId: string;
    addressTitle: string;
    postalCode: string;
    addressText: string;
}