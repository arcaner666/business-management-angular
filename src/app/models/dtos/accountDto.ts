export interface AccountDto {
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
}