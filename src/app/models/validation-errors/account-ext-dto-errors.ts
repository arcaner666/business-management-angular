export interface AccountExtDtoErrors {
    accountId: string;
    businessId: string;
    branchId: string;
    accountGroupId: string;
    accountTypeId: string;
    accountOrder: string;
    accountName: string;
    accountCode: string;
    debitBalance: string;
    creditBalance: string;
    balance: string;
    limit: string;
    createdAt: string;
    updatedAt: string;

    // Extended With Branch
    branchName: string;

    // Extended With AccountGroup
    accountGroupName: string;
    accountGroupCode: string;

    // Extended With AccountType
    accountTypeName: string;

    // Added Custom Required Fields
    nameSurname: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: string;
    notes: string;
    avatarUrl: string;
    taxOffice: string;
    taxNumber: string;
    identityNumber: string;
    standartMaturity: string;
}
