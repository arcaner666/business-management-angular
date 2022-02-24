export interface TenantDto {
    tenantId: number;
    businessId: number;
    branchId: number;
    accountId: number;
    nameSurname: string;
    email: string;
    phone: string;
    dateOfBirth: Date;
    gender: string;
    notes: string;
    avatarUrl: string;
    createdAt: Date;
    updatedAt: Date;
}