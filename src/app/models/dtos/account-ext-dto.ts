export interface AccountExtDto {
    accountId: number;
    businessId: number;
    branchId: number;
    accountGroupId: number;
    accountTypeId: number;
    accountOrder: number;
    accountName: string;
    accountCode: string;
    debitBalance: number;
    creditBalance: number;
    balance: number;
    limit: number;
    createdAt: Date;
    updatedAt: Date;

    // Extended With Branch
    branchName: string;

    // Extended With AccountGroup
    accountGroupName: string;
    accountGroupCode: string;

    // Extended With AccountType
    accountTypeName: string;
}
