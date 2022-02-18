export interface ManagerExtDto {
    managerId: bigint;
    businessId: number;
    branchId: bigint;
    nameSurname: string;
    email: string;
    phone: string;
    dateOfBirth: Date;
    gender: string;
    notes: string;
    avatarUrl: string;
    createdAt: Date;
    updatedAt: Date;

    // Extended With Business
    businessName: string;

    // Extended With Branch + FullAddress
    cityId: number;
    districtId: number;
    addressText: string;
}