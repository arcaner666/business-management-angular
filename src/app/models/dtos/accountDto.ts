export interface AccountDto {
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
}