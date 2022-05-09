export interface ManagerDto {
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
}