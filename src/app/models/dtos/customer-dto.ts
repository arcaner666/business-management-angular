export interface CustomerDto {
    customerId: number;
    businessId: number;
    branchId: number;
    accountId: number;
    nameSurname: string;
    email: string;
    phone: string;
    dateOfBirth?: Date;
    gender: string;
    notes: string;
    avatarUrl: string;
    taxOffice: string;
    taxNumber?: number;
    identityNumber?: number;
    standartMaturity: number;
    appointmentsMade: number;
    productsPurchased: number;
    lastPurchaseDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}