export interface BranchExtDto {
    branchId: bigint;
    businessId: number;
    fullAddressId: bigint;
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