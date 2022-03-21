export interface BranchExtDto {
    branchId: number;
    businessId: number;
    fullAddressId: number;
    branchOrder: number;
    branchName: string;
    branchCode: string;
    createdAt: Date;
    updatedAt: Date;

    // Extended With FullAddress
    cityId: number;
    districtId: number;
    addressTitle: string;
    postalCode: number;
    addressText: string;
}