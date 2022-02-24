export interface AccountExtDto {
    accountId: number;
    businessId: number;
    branchId: number;
    accountGroupId: number;
    currencyId: number;
    accountOrder: number;
    accountName: string;
    accountCode: string;
    taxOffice: string;
    taxNumber: number;
    identityNumber: number;
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
