export interface BankExtDto {
    bankId: number;
    businessId: number;
    branchId: number;
    accountId: number;
    fullAddressId: number;
    bankName: string;
    bankBranchName: string;
    bankCode: string;
    bankBranchCode: string;
    bankAccountCode: string;
    iban: string;
    officerName: string;
    createdAt: Date;
    updatedAt: Date;

    // Extended With Branch
    branchName: string;

    // Extended With Account
    accountGroupId: number;
    currencyId: number;
    accountOrder: number;
    accountName: string;
    accountCode: string;

    // Extended With Account + AccountGroup
    accountGroupName: string;

    // Extended With Account + Currency
    currencyName: string;

    // Extended With FullAddress
    cityId: number;
    districtId: number;
    addressText: string;
}