export interface ManagerExtDto {
    managerId: number;
    businessId: number;
    branchId: number;
    nameSurname: string;
    email: string;
    phone: string;
    dateOfBirth?: Date;
    gender: string;
    notes: string;
    avatarUrl: string;
    taxOffice: string;
    taxNumber?: number;
    identityNumber?: number;
    createdAt: Date;
    updatedAt: Date;

    // Extended With Business
    businessName: string;

    // Extended With Branch + FullAddress
    cityId: number;
    districtId: number;
    addressText: string;
}