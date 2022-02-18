export interface BusinessDto {
    businessId: number;
    systemUserId: bigint;
    businessOrder: number;
    businessName: string;
    businessCode: string;
    createdAt: Date;
    updatedAt: Date;
}