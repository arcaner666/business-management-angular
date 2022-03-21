export interface AccountOperationDetailDto {
    accountOperationDetailId: number;
    businessId: number;
    branchId: number;
    accountOperationId: number;
    accountId: number;
    currencyId: number;
    documentCode: string;
    debitBalance: number;
    creditBalance: number;
    exchangeRate: number;
}