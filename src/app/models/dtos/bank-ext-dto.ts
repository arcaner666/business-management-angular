export interface BankExtDto {
    bankId: number;
    businessId: number;
    branchId: number;
    accountId: number;
    fullAddressId: number;
    currencyId: number;
    bankName: string;
    bankBranchName: string;
    bankCode: string;
    bankBranchCode: string;
    bankAccountCode: string;
    iban: string;
    officerName: string;
    standartMaturity: number;
    createdAt: Date;
    updatedAt: Date;

    // Extended With Branch
    branchName: string;

    // Extended With Account
    accountGroupId: number;
    accountOrder: number;
    accountName: string;
    accountCode: string;
    limit: number;

    // Extended With Account + AccountGroup
    accountGroupName: string;

    // Extended With FullAddress
    cityId: number;
    districtId: number;
    addressText: string;

    // Extended With Currency
    currencyName: string;
}