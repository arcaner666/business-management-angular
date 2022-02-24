export interface BankDto {
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
}