export interface AccountExtDto {
    accountId: bigint;
    businessId: number;
    branchId: bigint;
    accountGroupId: number;
    currencyId: number;
    accountOrder: number;
    accountName: string;
    accountCode: string;
    taxOffice: string;
    taxNumber: bigint;
    identityNumber: bigint;
    debitBalance: number;
    creditBalance: number;
    balance: number;
    limit: number;
    standartMaturity: number;
    createdAt: Date;
    updatedAt: Date;

    // Extended With Branch
    branchName: string;

    // Extended With AccountGroup
    accountGroupName: string;

    // Extended With Currency
    currencyName: string;

    // Added Custom Fields
    nameSurname: string;
    email: string;
    phone: string;
    dateOfBirth: Date;
    gender: string;
    notes: string;
    avatarUrl: string;
}
