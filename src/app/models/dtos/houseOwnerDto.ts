export interface HouseOwnerDto {
    houseOwnerId: bigint;
    businessId: number;
    branchId: bigint;
    accountId: bigint;
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