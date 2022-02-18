export interface AccountOperationDetailDto {
    accountOperationDetailId: bigint;
    businessId: number;
    branchId: bigint;
    accountOperationId: bigint;
    accountId: bigint;
    currencyId: number;
    documentCode: string;
    debitBalance: number;
    creditBalance: number;
    exchangeRate: number;
}