export interface AccountDto {
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
}