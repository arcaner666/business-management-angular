export interface CustomerDto {
    customerId: bigint;
    businessId: number;
    branchId: bigint;
    accountId: bigint;
    nameSurname: string;
    email: string;
    phone: string;
    dateOfBirth: Date;
    gender: string;
    notes: string;
    avatarUrl: string;
    appointmentsMade: number;
    productsPurchased: number;
    lastPurchaseDate: Date;
    createdAt: Date;
    updatedAt: Date;
}