export interface CashExtDto {
    cashId: number;
    businessId: number;
    branchId: number;
    accountId: number;
    currencyId: number;
    createdAt: Date;
    updatedAt: Date;
        
    // Extended With Account
    accountGroupId: number;
    accountOrder: number;
    accountName: string;
    accountCode: string;
    limit: number;

    // Extended With Currency
    currencyName: string;
}