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
    createdAt: Date;
    updatedAt: Date;

    // Extended With Account
    accountGroupId: number;
    accountOrder: number;
    accountName: string;
    accountCode: string;
    taxOffice: string;
    taxNumber: number;
    identityNumber: number;
    limit: number;
    standartMaturity: number;
}