export interface CustomerDto {
    customerId: number;
    businessId: number;
    branchId: number;
    accountId: number;
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