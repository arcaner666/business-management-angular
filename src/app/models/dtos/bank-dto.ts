export interface BankDto {
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
}