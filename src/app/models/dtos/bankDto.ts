export interface BankDto {
    bankId: bigint;
    businessId: number;
    branchId: bigint;
    accountId: bigint;
    fullAddressId: bigint;
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