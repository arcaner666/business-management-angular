export interface HouseOwnerExtDto {
    houseOwnerId: number;
    businessId: number;
    branchId: number;
    accountId: number;
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
    standartMaturity: number;
    createdAt: Date;
    updatedAt: Date;

    // Extended With Account
    accountGroupId: number;
    accountOrder: number;
    accountName: string;
    accountCode: string;
    limit: number;
}