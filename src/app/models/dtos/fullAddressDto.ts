export interface FullAddressDto {
    fullAddressId: bigint;
    cityId: number;
    districtId: number;
    addressTitle: string;
    postalCode: number;
    addressText: string;
    createdAt: Date;
    updatedAt: Date;
}