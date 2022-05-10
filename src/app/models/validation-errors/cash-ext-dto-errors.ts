export interface CashExtDtoErrors {
    cashId: string;
    businessId: string;
    branchId: string;
    accountId: string;
    currencyId: string;
    createdAt: string;
    updatedAt: string;
        
    // Extended With Account
    accountGroupId: string;
    accountOrder: string;
    accountName: string;
    accountCode: string;
    limit: string;
    
    // Extended With Currency
    currencyName: string;
}