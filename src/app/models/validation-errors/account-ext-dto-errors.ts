export interface AccountExtDtoErrors {
    accountId: string;
    businessId: string;
    branchId: string;
    accountGroupId: string;
    currencyId: string;
    accountOrder: string;
    accountName: string;
    accountCode: string;
    taxOffice: string;
    taxNumber: string;
    identityNumber: string;
    debitBalance: string;
    creditBalance: string;
    balance: string;
    limit: string;
    standartMaturity: string;
    createdAt: string;
    updatedAt: string;

    // Extended With Branch
    branchName: string;

    // Extended With AccountGroup
    accountGroupName: string;
    accountGroupCode: string;

    // Extended With Currency
    currencyName: string;

    // Added Custom Fields
    accountTypeName: string;
    nameSurname: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: string;
    notes: string;
    avatarUrl: string;
}
