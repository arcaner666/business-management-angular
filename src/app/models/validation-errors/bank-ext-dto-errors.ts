export interface BankExtDtoErrors {
    bankId: string;
    businessId: string;
    branchId: string;
    accountId: string;
    fullAddressId: string;
    currencyId: string;
    bankName: string;
    bankBranchName: string;
    bankCode: string;
    bankBranchCode: string;
    bankAccountCode: string;
    iban: string;
    officerName: string;
    standartMaturity: string;
    createdAt: string;
    updatedAt: string;

    // Extended With Branch
    branchName: string;

    // Extended With Account
    accountGroupId: string;
    accountOrder: string;
    accountName: string;
    accountCode: string;
    limit: string;

    // Extended With Account + AccountGroup
    accountGroupName: string;

    // Extended With FullAddress
    cityId: string;
    districtId: string;
    addressText: string;

    // Extended With Currency
    currencyName: string;
}