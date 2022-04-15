export interface HouseOwnerExtDtoErrors {
    houseOwnerId: string;
    businessId: string;
    branchId: string;
    accountId: string;
    nameSurname: string;
    email: string;
    phone: string;
    dateOfBirth?: string;
    gender: string;
    notes: string;
    avatarUrl: string;
    createdAt: string;
    updatedAt: string;

    // Extended With Account
    accountGroupId: string;
    accountOrder: string;
    accountName: string;
    accountCode: string;
    taxOffice: string;
    taxNumber: string;
    identityNumber: string;
    limit: string;
    standartMaturity: string;
}