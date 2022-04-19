export interface AccountExtDtoErrors {
    accountId: string;
    businessId: string;
    branchId: string;
    accountGroupId: string;
    accountTypeId: string;
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

    // Extended With AccountType
    accountTypeName: string;

    // Added Custom Required Fields
    nameSurname: string;
    phone: string;
}
