export interface ManagerDto {
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
}